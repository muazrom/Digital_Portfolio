// Minimal frontmatter parser. Hand-rolled for the same reason the markdown
// renderer and the icon set are: this is ~60 lines against a dependency, and
// the project ships React and nothing else at runtime.
//
// Supports what the content files actually need and nothing more:
//   key: value            strings, numbers, booleans, null
//   key: [a, b, c]        inline lists
//   key:                  block lists, one "- item" per line
//     - a
//   key: >                folded block — indented lines joined with spaces
//     long text
// Anything it can't parse is skipped rather than throwing, so one malformed
// line can't take the whole site down at build time.

function coerce(value) {
  const v = String(value).trim()
  if (v.startsWith('[') && v.endsWith(']')) {
    return v.slice(1, -1).split(',').map(coerce).filter((x) => x !== null && x !== '')
  }
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1)
  }
  if (v === 'true') return true
  if (v === 'false') return false
  if (v === 'null' || v === '~' || v === '') return null
  // Dates like 2026-08-19 keep their dashes and stay strings, which is what
  // every consumer sorts and formats on.
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v)
  return v
}

export function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(raw)
  if (!match) return { data: {}, body: raw }

  const data = {}
  const lines = match[1].split(/\r?\n/)
  let key = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim() || /^\s*#/.test(line)) continue

    const item = /^\s*-\s+(.*)$/.exec(line)
    if (item && key) {
      if (!Array.isArray(data[key])) data[key] = []
      data[key].push(coerce(item[1]))
      continue
    }

    const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line)
    if (!kv) continue
    key = kv[1]
    const value = kv[2].trim()

    if (value === '>' || value === '|') {
      const folded = []
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) {
        folded.push(lines[++i].trim())
      }
      data[key] = folded.join(value === '>' ? ' ' : '\n')
      continue
    }

    data[key] = value === '' ? '' : coerce(value)
  }

  return { data, body: raw.slice(match[0].length) }
}

/** Strip the frontmatter block, leaving the prose. Used at runtime too. */
export function stripFrontmatter(raw) {
  return String(raw).replace(/^---\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)/, '').replace(/^\n+/, '')
}
