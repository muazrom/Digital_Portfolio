import Icon from './Icon'
import { publishedWriteups } from '../content/writeups'
import { formatDate } from '../pages/WriteupsPage'

const PREVIEW_COUNT = 3

export default function FieldNotes({ id, num, icon }) {
  const all = publishedWriteups()
  // Nothing published yet? Render nothing. An empty section with a promise in it
  // is weaker than no section at all.
  if (all.length === 0) return null

  const recent = all.slice(0, PREVIEW_COUNT)

  return (
    <section id={id} className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6">
        <p className="section-number mb-2">// {num}</p>
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-2.5 mb-2"><Icon name={icon} size={18} style={{ color: 'var(--accent)' }} /><h2 className="section-title">Field Notes</h2></div>
          {all.length > PREVIEW_COUNT && (
            <a href="#/writeups" style={{
              fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--accent-text)', textDecoration: 'none',
            }}>
              All {all.length} →
            </a>
          )}
        </div>
        <p className="font-mono text-xs text-muted mb-10">
          FIELD_NOTES // what I worked out while studying, including what I got wrong first
        </p>

        <div style={{ display: 'grid', gap: 10 }}>
          {recent.map(w => (
            <a key={w.slug} href={`#/writeups/${w.slug}`} style={{
              display: 'block', textDecoration: 'none',
              background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 10,
              padding: '16px 18px', transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 5 }}>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9.5, color: 'var(--text-dim)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Icon name="calendar" size={11} />{formatDate(w.date)}
                </span>
                {w.source?.platform && (
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9.5, color: 'var(--text-faintest)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Icon name="flask" size={11} />{w.source.platform}
                  </span>
                )}
              </div>
              <h3 style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 15.5, fontWeight: 600,
                color: 'var(--text-strong)', marginBottom: 5, lineHeight: 1.35,
              }}>
                {w.title}
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: 12.5, lineHeight: 1.6, color: 'var(--text-muted)',
              }}>
                {w.summary}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
