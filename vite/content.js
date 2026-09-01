import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { parseFrontmatter } from './frontmatter.js'

// Turns content/writeups and content/credentials into a virtual module, so
// publishing is "drop one file in a folder" instead of "add a file, then also
// hand-write a matching entry in a JS array and remember to bump a version".
//
// The bodies are deliberately NOT included here — the site lazy-loads them
// through import.meta.glob so the homepage never downloads prose it doesn't
// show. This module carries metadata only.

const VIRTUAL_ID = 'virtual:content'
const RESOLVED_ID = '\0' + VIRTUAL_ID

const WRITEUPS_DIR = 'content/writeups'
const CREDENTIALS_DIR = 'content/credentials'
const TRACKS_DIR = 'content/tracks'

// Matches the ~195 wpm the ten hand-written entries were calibrated at, so
// auto-computed read times sit on the same scale as the ones they replace.
const WORDS_PER_MINUTE = 195

// README.md documents the folder; a leading _ or . marks a file as not content.
// Without this the folder's own docs get published as a write-up, which is
// exactly what happened the first time.
const isContent = (f) =>
  f.endsWith('.md') && f !== 'README.md' && !f.startsWith('_') && !f.startsWith('.')

const mdFiles = (dir) =>
  fs.existsSync(dir) ? fs.readdirSync(dir).filter(isContent).sort() : []

function readWriteups(root) {
  const dir = path.join(root, WRITEUPS_DIR)
  return mdFiles(dir).map((file) => {
    const slug = file.replace(/\.md$/, '')
    const { data, body } = parseFrontmatter(fs.readFileSync(path.join(dir, file), 'utf8'))
    const words = body.split(/\s+/).filter(Boolean).length
    return {
      slug,
      title: data.title || slug,
      date: String(data.date || ''),
      updated: data.updated ? String(data.updated) : null,
      summary: data.summary || '',
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
      source: {
        platform: data.platform || null,
        name: data.course || null,
        url: data.url || null,
      },
      // Stated read time wins; otherwise it's derived from the prose, which is
      // one less field to keep honest by hand.
      minutes: data.minutes || Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
      status: data.status || 'published',
      relatedCredential: data.credential || null,
    }
  })
}

// A local filename is resolved against the file's own folder and handed to
// Vite's asset pipeline; anything already absolute or remote passes through.
const isExternal = (v) => typeof v === 'string' && (v.startsWith('/') || /^https?:\/\//.test(v))

function readCredentials(root, assets) {
  const dir = path.join(root, CREDENTIALS_DIR)
  return mdFiles(dir).map((file) => {
    const id = file.replace(/\.md$/, '')
    const { data } = parseFrontmatter(fs.readFileSync(path.join(dir, file), 'utf8'))

    const asset = (value) => {
      if (!value) return null
      if (isExternal(value)) return value
      const abs = path.join(dir, String(value))
      if (!fs.existsSync(abs)) {
        console.warn(`[content] ${file}: referenced file not found — ${value}`)
        return null
      }
      const token = `__ASSET_${assets.length}__`
      assets.push(abs.split(path.sep).join('/'))
      return token
    }

    return {
      id,
      name: data.name || id,
      issuer: data.issuer || '',
      kind: data.kind || 'course',
      topic: data.topic || null,
      date: String(data.date || ''),
      image: asset(data.image),
      credential: asset(data.credential),
    }
  })
}

// A track is a series of credentials leading to one capstone, and it's the only
// thing here allowed to name something not yet earned — credentials/ stays
// earned-only. A step carries `Label | credential-id`, and the id is resolved
// lazily against that folder: write it before the course is taken and the step
// flips from pending to earned the day the badge file lands, with nothing to
// edit here. See content/tracks/README.md.
function readTracks(root, credentialIds) {
  const dir = path.join(root, TRACKS_DIR)

  return mdFiles(dir).map((file) => {
    const id = file.replace(/\.md$/, '')
    const { data } = parseFrontmatter(fs.readFileSync(path.join(dir, file), 'utf8'))
    const steps = (Array.isArray(data.steps) ? data.steps : []).map((raw) => {
      const [label, credential] = String(raw).split('|').map((s) => s.trim())
      return { label, credential: credential || null }
    })

    // An unresolved id is the normal state of a course not taken yet, so this
    // can't warn per step — it would fire on every build and be ignored, and a
    // typo is indistinguishable from a pending course anyway. One quiet line per
    // track instead: enough to spot a misspelled id, quiet enough to keep the
    // signal when a step really is just unearned.
    const pending = steps.filter((s) => s.credential && !credentialIds.has(s.credential))
    if (pending.length) {
      const names = pending.map((s) => s.credential).join(', ')
      console.info(`[content] ${file}: ${steps.length - pending.length}/${steps.length} steps earned — pending ${names}`)
    }

    // The capstone is a credential id once earned, and a plain display name
    // until then — which is exactly how the rack tells complete from running.
    const capstone = String(data.capstone || '')
    const earnedCapstone = credentialIds.has(capstone)

    return {
      id,
      name: data.name || id,
      issuer: data.issuer || '',
      capstone: earnedCapstone ? capstone : null,
      target: earnedCapstone ? null : { name: capstone, kind: data.capstone_kind || 'certification' },
      exam: data.exam === true,
      steps,
    }
  })
}

function buildModule(root) {
  const assets = []
  const writeups = readWriteups(root)
  const credentials = readCredentials(root, assets)
  const tracks = readTracks(root, new Set(credentials.map((c) => c.id)))

  // Only the credential content feeds this hash. Dropping or editing a badge
  // then has to invalidate a stale localStorage snapshot on its own — the whole
  // point of the folder is that adding one takes no second step to remember.
  const credentialsHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(credentials))
    .digest('hex')
    .slice(0, 8)

  const imports = assets.map((file, i) => `import __asset_${i} from ${JSON.stringify(file)}`).join('\n')
  const serialise = (value) =>
    JSON.stringify(value, null, 2).replace(/"__ASSET_(\d+)__"/g, (_, i) => `__asset_${i}`)

  return `${imports}
export const writeups = ${serialise(writeups)}
export const credentials = ${serialise(credentials)}
export const tracks = ${serialise(tracks)}
export const credentialsHash = ${JSON.stringify(credentialsHash)}
`
}

export default function contentPlugin() {
  let root = process.cwd()

  const isContentFile = (file) => {
    const rel = path.relative(root, file).split(path.sep).join('/')
    return rel.startsWith('content/')
  }

  return {
    name: 'workshop-content',
    enforce: 'pre',

    configResolved(config) {
      root = config.root
    },

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },

    load(id) {
      if (id === RESOLVED_ID) return buildModule(root)
    },

    configureServer(server) {
      for (const dir of [WRITEUPS_DIR, CREDENTIALS_DIR, TRACKS_DIR]) {
        server.watcher.add(path.join(root, dir))
      }
      // A file appearing or disappearing isn't a change to a module Vite knows
      // about, so neither event reaches handleHotUpdate — they need catching
      // here or a newly dropped write-up stays invisible until a restart.
      for (const event of ['add', 'unlink']) {
        server.watcher.on(event, (file) => {
          if (isContentFile(file)) invalidate(server)
        })
      }
    },

    handleHotUpdate({ file, server }) {
      if (!isContentFile(file)) return
      invalidate(server)
    },
  }
}

function invalidate(server) {
  const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
  if (mod) server.moduleGraph.invalidateModule(mod)
  server.ws.send({ type: 'full-reload' })
}
