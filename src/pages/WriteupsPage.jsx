import { useEffect, useMemo, useState } from 'react'
import { publishedWriteups, writeupBySlug, loadBody } from '../content/writeups'
import { renderMarkdown } from '../lib/markdown'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  if (!m) return y
  return d ? `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}` : `${MONTHS[Number(m) - 1]} ${y}`
}

const SITE_TITLE = "Mu'az Arief — Networking & Security · CS @ University Malaya"

// No Helmet — a direct write is all a title needs, and the hash router means
// this is the only place the document title ever changes.
function useDocumentTitle(title, description) {
  useEffect(() => {
    document.title = title
    const meta = document.querySelector('meta[name="description"]')
    const previous = meta?.getAttribute('content')
    if (meta && description) meta.setAttribute('content', description)
    return () => {
      document.title = SITE_TITLE
      if (meta && previous) meta.setAttribute('content', previous)
    }
  }, [title, description])
}

function Tag({ children }) {
  return (
    <span style={{
      fontFamily: 'JetBrains Mono', fontSize: 9, color: '#7b8794',
      border: '1px solid #2a2a2a', borderRadius: 99, padding: '2px 8px',
    }}>
      {children}
    </span>
  )
}

function BackLink({ to, label }) {
  return (
    <a href={to} style={{
      fontFamily: 'JetBrains Mono', fontSize: 11, color: '#93b4ff', textDecoration: 'none',
      display: 'inline-flex', alignItems: 'center', gap: 6,
    }}>
      ← {label}
    </a>
  )
}

function WriteupCard({ w }) {
  return (
    <a href={`#/writeups/${w.slug}`} style={{
      display: 'block', textDecoration: 'none',
      background: '#0f0f0f', border: '1px solid #232323', borderRadius: 10,
      padding: '18px 20px', transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(37,99,235,0.5)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#232323' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9.5, color: '#666' }}>
          {formatDate(w.date)}
        </span>
        {w.minutes && (
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9.5, color: '#4a4a4a' }}>
            · {w.minutes} min
          </span>
        )}
        {w.source?.platform && (
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9.5, color: '#4a4a4a' }}>
            · {w.source.platform}
          </span>
        )}
      </div>
      <h3 style={{
        fontFamily: 'Space Grotesk, sans-serif', fontSize: 17, fontWeight: 600,
        color: '#eaeaea', marginBottom: 7, lineHeight: 1.35,
      }}>
        {w.title}
      </h3>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: 13, lineHeight: 1.65, color: '#8a8a8a',
        marginBottom: 12,
      }}>
        {w.summary}
      </p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {(w.tags || []).map(t => <Tag key={t}>{t}</Tag>)}
      </div>
    </a>
  )
}

function WriteupsIndex() {
  const items = publishedWriteups()
  useDocumentTitle(
    `Field Notes — ${SITE_TITLE}`,
    'Study writeups from working through networking and security material.'
  )

  return (
    <div className="max-w-3xl mx-auto px-6" style={{ paddingTop: 120, paddingBottom: 96 }}>
      <BackLink to="#" label="Back to site" />
      <h1 className="section-title" style={{ marginTop: 20, marginBottom: 8 }}>Field Notes</h1>
      <p className="font-mono text-xs text-muted" style={{ marginBottom: 40 }}>
        FIELD_NOTES // what I worked out while studying, including what I got wrong first
      </p>

      {items.length === 0 ? (
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#666', lineHeight: 1.8 }}>
          Nothing published yet.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {items.map(w => <WriteupCard key={w.slug} w={w} />)}
        </div>
      )}
    </div>
  )
}

function WriteupDetail({ slug }) {
  const w = writeupBySlug(slug)
  const [body, setBody] = useState(null)
  useDocumentTitle(w ? `${w.title} — Field Notes` : `Not found — ${SITE_TITLE}`, w?.summary)

  useEffect(() => {
    if (!w) return
    let cancelled = false
    setBody(null)
    loadBody(w.slug).then((md) => { if (!cancelled) setBody(md ?? '') })
    return () => { cancelled = true }
  }, [w?.slug])

  const html = useMemo(() => (body ? renderMarkdown(body) : ''), [body])

  if (!w) {
    return (
      <div className="max-w-3xl mx-auto px-6" style={{ paddingTop: 120, paddingBottom: 96 }}>
        <BackLink to="#/writeups" label="All field notes" />
        <h1 className="section-title" style={{ marginTop: 20, marginBottom: 10 }}>Not found</h1>
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#666' }}>
          No published writeup at <code>{slug}</code>.
        </p>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto px-6" style={{ paddingTop: 120, paddingBottom: 96 }}>
      <BackLink to="#/writeups" label="All field notes" />

      <h1 style={{
        fontFamily: 'Space Grotesk, sans-serif', fontSize: 34, fontWeight: 700,
        color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2,
        marginTop: 20, marginBottom: 12,
      }}>
        {w.title}
      </h1>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#666' }}>
          {formatDate(w.date)}
        </span>
        {w.updated && (
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4a4a4a' }}>
            · updated {formatDate(w.updated)}
          </span>
        )}
        {w.minutes && (
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4a4a4a' }}>
            · {w.minutes} min
          </span>
        )}
        {w.source?.name && (
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4a4a4a' }}>
            · {w.source.platform ? `${w.source.platform} — ` : ''}{w.source.name}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 32 }}>
        {(w.tags || []).map(t => <Tag key={t}>{t}</Tag>)}
      </div>

      {body === null ? (
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#555' }}>Loading…</p>
      ) : (
        <div className="writeup-body" dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </article>
  )
}

export default function WriteupsPage({ slug }) {
  return slug ? <WriteupDetail slug={slug} /> : <WriteupsIndex />
}
