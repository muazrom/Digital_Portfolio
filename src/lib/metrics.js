// Every number the console displays is derived here, from real content only:
// src/data/defaults.js (via DataContext) and src/content/writeups/index.js.
//
// The rule this file exists to enforce: no fabricated telemetry. A SIEM shows
// live traffic; a portfolio has none, and inventing "1,284 threats blocked" would
// undercut the honesty rule defaults.js already applies to the skills board. So
// the panels get gauges and sparklines fed by things a visitor can go and count
// for themselves further down the page.

import { publishedWriteups } from '../content/writeups'

/** Credentials grouped by `kind`, in the order Credentials.jsx ranks them. */
export const KIND_ORDER = ['certification', 'path', 'course', 'module']

export function credentialStats(credentials = []) {
  const byKind = Object.fromEntries(KIND_ORDER.map(k => [k, 0]))
  let verifiable = 0
  for (const c of credentials) {
    if (byKind[c.kind] === undefined) byKind[c.kind] = 0
    byKind[c.kind] += 1
    // Matches Credentials.jsx's isVerifiable: a public URL is the only thing
    // that makes a credential checkable by someone other than me.
    if (c.credential) verifiable += 1
  }
  return { total: credentials.length, byKind, verifiable }
}

/** Tool counts and a 0..1 aggregate per skill group. level is 1..3. */
export function skillStats(skills = []) {
  const groups = skills.map(g => {
    const tools = g.tools || []
    const sum = tools.reduce((s, t) => s + (t.level || 0), 0)
    return {
      id: g.id,
      label: g.label,
      icon: g.icon,
      count: tools.length,
      // Mean level normalised to 0..1 against the 3-point scale.
      strength: tools.length ? sum / (tools.length * 3) : 0,
    }
  })
  return { groups, toolCount: groups.reduce((s, g) => s + g.count, 0) }
}

export function projectStats(projects = []) {
  const byStatus = {}
  for (const p of projects) byStatus[p.status] = (byStatus[p.status] || 0) + 1
  return { total: projects.length, byStatus, live: byStatus.Live || 0 }
}

export function experienceStats(experience = []) {
  const technical = experience.filter(e => e.track === 'technical').length
  return { total: experience.length, technical, leadership: experience.length - technical }
}

/** Totals for the write-up archive. */
export function writeupActivity() {
  const all = publishedWriteups()
  return {
    total: all.length,
    // publishedWriteups() sorts newest first.
    latest: all.length ? all[0].date : null,
  }
}

/**
 * Write-ups grouped by the course they came from, largest first.
 * `source.name` carries a module suffix ('… — Packet Tracer', '… — Concepts')
 * that splits one course across several rows, so the course name is everything
 * before the em dash.
 */
export function writeupsByCourse() {
  const counts = new Map()
  for (const w of publishedWriteups()) {
    const course = String(w.source?.name || 'Self-directed').split(' — ')[0]
    counts.set(course, (counts.get(course) || 0) + 1)
  }
  const total = publishedWriteups().length || 1
  return [...counts.entries()]
    .map(([course, count]) => ({ course, count, share: count / total }))
    .sort((a, b) => b.count - a.count)
}

/**
 * Progress toward the first job on the pathway — a junior network engineer role
 * entered at graduation, February 2028.
 *
 * Two of these are real counts and come from the same functions the rest of the
 * console uses, so they track the content instead of being typed in. The other
 * three are status rows, and all three are deliberately unfinished: CCNA is
 * being studied for, not held; the internship is still running; the degree is a
 * 2028 target. Nothing here may render as done until it actually is.
 */
export const STAGE1_TARGET = 'Feb 2028'

export function stage1Readiness(data) {
  const notes = writeupActivity().total
  const badges = data.credentials.length

  return [
    { label: 'CCNA', detail: 'studying', done: false },
    // The one piece of cloud that belongs before graduation: foundational, and
    // it sits under the SAA-C03 that Stage 2 actually gates on. 'planned'
    // rather than 'studying' — CCNA is the one being studied for right now.
    { label: 'AWS Cloud Practitioner', code: 'CLF-C02', detail: 'planned', done: false },
    { label: 'Write-ups published', held: notes, target: 50, done: notes >= 50 },
    { label: 'Completion badges', held: badges, target: 15, done: badges >= 15 },
    { label: 'Infrastructure internship', detail: 'in progress', done: false },
    { label: 'B.CS degree (UM)', detail: STAGE1_TARGET, done: false },
  ]
}

/** Per-section counts for the nav rail badges. Keys are section ids. */
export function sectionCounts(data) {
  return {
    about: null,
    skills: skillStats(data.skills).toolCount,
    credentials: data.credentials.length,
    fieldnotes: publishedWriteups().length,
    experience: data.experience.length,
    projects: data.projects.length,
    contact: null,
  }
}

/**
 * The right-hand readout in each panel header. Same derivations as the nav rail
 * badges, so a header can't claim a count the rows underneath don't back up.
 */
export function panelMeta(data) {
  const creds = credentialStats(data.credentials)
  const skills = skillStats(data.skills)
  const projects = projectStats(data.projects)
  const exp = experienceStats(data.experience)
  const notes = writeupActivity()

  return {
    about: `${data.about.focus.length} focus areas`,
    skills: `${skills.groups.length} groups · ${skills.toolCount} tools`,
    credentials: `${creds.total} earned · ${creds.verifiable} verifiable`,
    fieldnotes: notes.latest ? `${notes.total} entries · latest ${notes.latest}` : `${notes.total} entries`,
    experience: `${exp.technical} technical · ${exp.leadership} leadership`,
    projects: `${projects.total} tracked · ${projects.live} live`,
    contact: 'open to opportunities',
  }
}
