import Icon from '../Icon'
import { useScrollReveal } from '../../hooks/useScrollReveal'

// The console's one chassis. Every section renders inside one of these, so the
// anchor id, the section number, the icon, and the title all come from
// src/sections.js in a single place — a section component can no longer disagree
// with the nav rail about what it's called.
//
// `meta` is the right-hand readout in the header strip: a live count derived from
// the panel's own content ("6 groups · 27 tools"). It is the honesty check — if a
// panel claims a number, the rows underneath it have to add up.
export default function Panel({ id, index, label, icon, meta, children, flush = false }) {
  const ref = useScrollReveal()

  return (
    <section id={id} ref={ref} className="reveal console-panel">
      <header className="console-panel-head">
        <span className="font-mono console-panel-index">
          {String(index).padStart(2, '0')}
        </span>
        <span className="console-panel-sep" />
        {icon && <Icon name={icon} size={13} style={{ color: '#2563eb' }} />}
        <h2 className="font-mono console-panel-title">{label}</h2>
        {meta && <span className="font-mono console-panel-meta">{meta}</span>}
      </header>
      <div className="console-panel-body" style={flush ? { padding: 0 } : undefined}>
        {children}
      </div>
    </section>
  )
}
