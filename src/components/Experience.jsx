import Icon from './Icon'
import { useData } from '../context/DataContext'

// Two timelines, one per track. The rotating SVG ring this replaces showed one
// role at a time and needed arrows to reach the rest; a console shouldn't hide
// records behind an animation. The track split is kept — a technical internship
// shouldn't be diluted by six event roles — but each track is now a rail you can
// read top to bottom.

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

// Periods are freeform ('Jul 2026 – Present', '2024', 'Apr 2025 & 2026'), so this
// pulls out the latest year and month it can find purely to order the rail.
// Anything unparseable sorts last rather than throwing the list out of order.
function sortKey(period = '') {
  const years = [...String(period).matchAll(/\b(20\d{2})\b/g)].map(m => Number(m[1]))
  const year = years.length ? Math.max(...years) : 0
  const monthMatch = MONTHS.findIndex(m => String(period).toLowerCase().includes(m))
  const ongoing = /present|current/i.test(period)
  return year * 100 + (ongoing ? 99 : monthMatch + 1)
}

const isOngoing = (period) => /present|current/i.test(period || '')

function Track({ title, note, icon, items }) {
  if (items.length === 0) return null
  const sorted = [...items].sort((a, b) => sortKey(b.period) - sortKey(a.period))

  return (
    <div className="console-track">
      <div className="console-track-head">
        <Icon name={icon} size={13} style={{ color: '#2563eb' }} />
        <span className="font-mono console-track-title">{title}</span>
        <span className="font-mono console-track-note">{note}</span>
        <span className="font-mono console-track-count">{items.length}</span>
      </div>

      <ol className="console-rail">
        {sorted.map((e) => {
          const live = isOngoing(e.period)
          return (
            <li key={e.id} className="console-rail-item">
              <span
                aria-hidden="true"
                className={`console-rail-node${live ? ' is-live' : ''}`}
              />
              <div className="console-rail-body">
                <div className="console-rail-meta">
                  <span className="font-mono console-rail-period">{e.period}</span>
                  {live && <span className="font-mono console-rail-active">ACTIVE</span>}
                </div>
                <h4 className="console-rail-role">{e.role}</h4>
                <p className="font-mono console-rail-org">{e.org}</p>
                <p className="console-rail-summary">{e.summary}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default function Experience() {
  const { data } = useData()
  const experiences = data.experience
  if (experiences.length === 0) return null

  const technical = experiences.filter(e => e.track === 'technical')
  const leadership = experiences.filter(e => e.track === 'leadership')
  // A role with no track still has to appear somewhere, so it falls in with the
  // technical rail rather than vanishing.
  const untracked = experiences.filter(e => e.track !== 'technical' && e.track !== 'leadership')

  return (
    <div className="console-tracks">
      <Track
        title="TECHNICAL TRACK"
        note="paid and competitive work"
        icon="server"
        items={[...technical, ...untracked]}
      />
      <Track
        title="LEADERSHIP TRACK"
        note="committee and event roles"
        icon="users"
        items={leadership}
      />
    </div>
  )
}
