import { useState } from 'react'
import { useData } from '../context/DataContext'
import CaseStudyContent from './CaseStudy'
import Icon from './Icon'

// An inventory table. The 3D coverflow it replaces looked good but showed one
// project at a time and hid the rest at an angle — the opposite of what a
// console does. A table shows every row at once and sorts nothing away, and the
// case study opens in place instead of behind a card flip.
const statusColor = {
  Live: '#22c55e',
  'In Development': '#f59e0b',
  Ongoing: '#60a5fa',
  Completed: '#8a8a8a',
}
const colorOf = (s) => statusColor[s] || '#8a8a8a'

function Links({ p, size = 10 }) {
  const items = [
    p.live && { href: p.live, label: 'Live', icon: 'external' },
    p.github && { href: p.github, label: 'Repo', icon: 'gitBranch' },
    p.image && { href: p.image, label: 'Shot', icon: 'monitor' },
  ].filter(Boolean)

  return (
    <span style={{ display: 'inline-flex', gap: 12, flexWrap: 'wrap' }}>
      {items.map((it) => (
        <a
          key={it.label}
          href={it.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="font-mono console-proj-link"
          style={{ fontSize: size }}
        >
          <Icon name={it.icon} size={11} />
          {it.label}
        </a>
      ))}
    </span>
  )
}

export default function Projects() {
  const { data } = useData()
  const projects = data.projects
  const [openId, setOpenId] = useState(null)

  return (
    <div>
      <p className="font-mono console-panel-caption">
        Security-relevant work, plus the tooling I build to automate things.
      </p>

      <div className="console-table">
        <div className="console-table-head font-mono">
          <span>STATUS</span>
          <span>PROJECT</span>
          <span>STACK</span>
          <span>LINKS</span>
        </div>

        {projects.map((p) => {
          const isOpen = openId === p.id
          const c = colorOf(p.status)
          return (
            <div key={p.id} className={`console-table-group${isOpen ? ' is-open' : ''}`}>
              <button
                type="button"
                className="console-table-row"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : p.id)}
              >
                <span className="console-proj-status font-mono" style={{ color: c }}>
                  <span
                    aria-hidden="true"
                    style={{
                      width: 6, height: 6, borderRadius: '50%', background: c,
                      boxShadow: `0 0 6px ${c}`, flexShrink: 0,
                    }}
                  />
                  {p.status}
                </span>

                <span className="console-proj-main">
                  <span className="console-proj-name">{p.name}</span>
                  <span className="console-proj-desc">{p.description}</span>
                </span>

                <span className="console-proj-stack">
                  {p.stack.map((t) => (
                    <span key={t} className="font-mono console-proj-tech">{t}</span>
                  ))}
                </span>

                <span className="console-proj-links">
                  <Links p={p} />
                  <span className="font-mono console-proj-expand" aria-hidden="true">
                    {isOpen ? '− Close' : '+ Detail'}
                  </span>
                </span>
              </button>

              {isOpen && (
                <div className="console-proj-detail">
                  <CaseStudyContent caseStudy={p.caseStudy} twoColumn />
                  <div className="console-proj-detail-foot">
                    <Links p={p} size={11} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
