import { useEffect, useRef, useState } from 'react'
import Icon from '../Icon'
import { sections } from '../../sections'
import { useData } from '../../context/DataContext'
import { sectionCounts } from '../../lib/metrics'
import { SeverityDot } from './widgets'

// Replaces the old floating Navbar. Same three jobs it had — scroll-spy, the
// hidden #admin keystroke, Escape/scroll-lock — rendered as a device tree.
//
// The count badge next to each entry is the same number the panel's own header
// reports, both from lib/metrics.js, so the rail can't advertise a count the
// panel doesn't back up.
const SECRET = '#admin'

export default function NavRail() {
  const { data } = useData()
  const buffer = useRef('')
  const [active, setActive] = useState('')
  const counts = sectionCounts(data)

  useEffect(() => {
    const observed = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    )
    observed.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return
      buffer.current = (buffer.current + e.key).slice(-SECRET.length)
      if (buffer.current === SECRET) {
        buffer.current = ''
        window.location.hash = 'admin'
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <nav className="console-navrail" aria-label="Console sections">
      <div className="console-navrail-head font-mono">
        <span>NODES</span>
        <span style={{ color: '#3a3a3a' }}>{sections.length}</span>
      </div>

      <ul className="console-navrail-list">
        <li>
          <a href="#overview" className={`console-navitem${active === 'overview' ? ' is-active' : ''}`}>
            <SeverityDot sev={active === 'overview' ? 'link' : 'idle'} size={5} steady />
            <Icon name="pulse" size={14} />
            <span className="console-navitem-label">Overview</span>
          </a>
        </li>
        {sections.map(({ id, label, icon }) => {
          const isActive = active === id
          const count = counts[id]
          return (
            <li key={id}>
              <a href={`#${id}`} className={`console-navitem${isActive ? ' is-active' : ''}`}>
                <SeverityDot sev={isActive ? 'link' : 'idle'} size={5} steady />
                <Icon name={icon} size={14} />
                <span className="console-navitem-label">{label}</span>
                {count != null && (
                  <span className="console-navitem-index font-mono">{count}</span>
                )}
              </a>
            </li>
          )
        })}
      </ul>

      <div className="console-navrail-foot font-mono">
        <a href="#/writeups" className="console-navitem console-navitem-sub">
          <Icon name="notes" size={13} />
          <span className="console-navitem-label">Archive</span>
        </a>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="console-navitem console-navitem-sub">
          <Icon name="external" size={13} />
          <span className="console-navitem-label">Resume</span>
        </a>
      </div>
    </nav>
  )
}
