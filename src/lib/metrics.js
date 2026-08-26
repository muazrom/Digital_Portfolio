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

/**
 * Write-ups per month over the trailing `months` window, oldest first.
 * Returns { series, labels, total, latest } — `latest` is the most recent ISO date.
 */
export function writeupActivity(months = 12) {
  const all = publishedWriteups()
  const now = new Date()
  const keys = []
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  const counts = Object.fromEntries(keys.map(k => [k, 0]))
  for (const w of all) {
    const k = String(w.date).slice(0, 7)
    if (k in counts) counts[k] += 1
  }
  return {
    series: keys.map(k => counts[k]),
    labels: keys,
    total: all.length,
    latest: all.length ? all[0].date : null,
  }
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
