import { useEffect, useMemo, useState } from 'react'
import { publishedWriteups, writeupBySlug, loadBody } from '../content/writeups'
import { renderMarkdown } from '../lib/markdown'
import Icon from '../components/Icon'

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
      display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      <Icon name="tag" size={10} />{children}
    </span>
  )
}

function BackLink({ to, label }) {
  return (
    <a href={to} style={{
      fontFamily: 'JetBrains Mono', fontSize: 11, color: '#93b4ff', textDecoration: 'none',
      display: 'inline-flex', alignItems: 'center', gap: 6,
    }}>
      <Icon name="external" size={12} style={{ transform: 'scaleX(-1)' }} />{label}
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
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9.5, color: '#666', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <Icon name="calendar" size={11} />{formatDate(w.date)}
        </span>
        {w.minutes && (
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9.5, color: '#4a4a4a', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Icon name="clock" size={11} />{w.minutes} min
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
  const [loadError, setLoadError] = useState(false)
  useDocumentTitle(w ? `${w.title} — Field Notes` : `Not found — ${SITE_TITLE}`, w?.summary)

  useEffect(() => {
    if (!w) return
    let cancelled = false
    setBody(null)
    setLoadError(false)
    loadBody(w.slug)
      .then((md) => { if (!cancelled) setBody(md ?? '') })
      // A body is a lazily-imported chunk, so it can fail independently of the page:
      // most likely mid-deploy, when the SPA fallback answers a not-yet-uploaded asset
      // with index.html and the browser caches that HTML against the chunk's URL.
      // Without this the reader sits on "Loading…" forever with nothing to act on.
      .catch(() => { if (!cancelled) setLoadError(true) })
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

      {loadError ? (
        <div style={{
          border: '1px solid #3a2a2a', background: 'rgba(239,68,68,0.05)',
          borderRadius: 8, padding: '16px 18px',
        }}>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#c98b8b', lineHeight: 1.7 }}>
            This writeup didn&rsquo;t load. Usually a cached response from a deploy that
            was still in flight — a hard reload clears it.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 12, background: 'none', border: '1px solid #3a2a2a',
              color: '#c98b8b', borderRadius: 4, padding: '7px 14px',
              cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: 11,
            }}>
            Reload
          </button>
        </div>
      ) : body === null ? (
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
