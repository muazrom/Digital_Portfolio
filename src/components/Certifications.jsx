import { useState } from 'react'
import { useData } from '../context/DataContext'

// Colour accent by domain. As the log fills up you can see the drift from
// systems-grey through network-blue into security — progression shown, not claimed.
const domainMeta = {
  network:  { main: '#2563eb', light: '#93b4ff', dark: '#0e1f4d', glow: 'rgba(37,99,235,0.35)' },
  security: { main: '#22c55e', light: '#86efac', dark: '#0f3d23', glow: 'rgba(34,197,94,0.30)' },
  systems:  { main: '#9ca3af', light: '#d4d8df', dark: '#2a2d33', glow: 'rgba(156,163,175,0.28)' },
}
const domainOf = (d) => domainMeta[d] || domainMeta.network

// Shape signals the rung, the way tier used to — same visual language, honest meaning.
const rungShape = {
  foundation:   'M50 3 L94.7 35.48 L77.63 88.02 L22.37 88.02 L5.3 35.48 Z',       // pentagon
  associate:    'M50 3 L90.7 26.5 L90.7 73.5 L50 97 L9.3 73.5 L9.3 26.5 Z',       // hexagon
  professional: 'M50 3 L86.75 20.7 L95.82 60.46 L70.39 92.35 L29.61 92.35 L4.18 60.46 L13.25 20.7 Z', // heptagon
}

const rungLabel = { foundation: 'Foundation', associate: 'Associate', professional: 'Professional' }

const kindLabel = { path: 'Learning path', course: 'Course', module: 'Module', lab: 'Lab' }

// '2026-06' -> 'Jun 2026'; a bare '2026' passes through unchanged.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function formatDate(iso) {
  if (!iso) return ''
  const [y, m] = iso.split('-')
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : y
}

/* ─────────────────────────── ladder ─────────────────────────── */

// `earned` gets a filled medal. `in_progress` gets the same shape, outlined only.
// `planned` never gets a medal at all — see PlannedMarker.
function RouteMedal({ rung, domain, filled, size = 60 }) {
  const c = domainOf(domain)
  const gid = `route-${rung}-${domain}-${filled ? 'f' : 'o'}`
  return (
    <svg width={size} height={size} viewBox="0 0 100 100"
      style={{ filter: filled ? `drop-shadow(0 0 10px ${c.glow})` : 'none' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.main} />
          <stop offset="100%" stopColor={c.dark} />
        </linearGradient>
      </defs>
      <path
        d={rungShape[rung] || rungShape.associate}
        fill={filled ? `url(#${gid})` : 'transparent'}
        stroke={filled ? c.light : c.main}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeDasharray={filled ? undefined : '5 4'}
        opacity={filled ? 1 : 0.75}
      />
    </svg>
  )
}

function PlannedMarker({ domain }) {
  const c = domainOf(domain)
  return (
    <div style={{
      width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 14, height: 14, borderRadius: '50%',
        border: `1.5px dashed ${c.main}`, opacity: 0.6,
      }} />
    </div>
  )
}

function LadderNode({ item, isLast }) {
  const c = domainOf(item.domain)
  const earned = item.status === 'earned'
  const planned = item.status === 'planned'

  return (
    <div style={{ display: 'flex', gap: 18, position: 'relative' }}>
      {/* rail */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        {planned ? <PlannedMarker domain={item.domain} />
                 : <RouteMedal rung={item.rung} domain={item.domain} filled={earned} />}
        {!isLast && (
          <div style={{
            flex: 1, width: 1, minHeight: 28,
            background: earned ? c.main : '#2a2a2a',
            opacity: earned ? 0.5 : 1,
            borderLeft: planned ? '1px dashed #2a2a2a' : 'none',
          }} />
        )}
      </div>

      {/* body */}
      <div style={{ paddingBottom: isLast ? 0 : 34, minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 17, fontWeight: 600,
            color: planned ? '#8a8a8a' : '#eaeaea',
          }}>
            {item.code}
          </span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9.5, color: '#666' }}>
            {item.vendor} · {rungLabel[item.rung] || item.rung}
          </span>
        </div>

        <p style={{
          fontFamily: 'JetBrains Mono', fontSize: 10.5, color: '#777', marginTop: 3,
        }}>
          {item.name}
        </p>

        {/* status line */}
        <div style={{ marginTop: 9, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {earned && (
            <>
              <span style={{
                fontFamily: 'JetBrains Mono', fontSize: 8.5, letterSpacing: '0.1em',
                color: c.light, background: c.glow, border: `1px solid ${c.main}`,
                padding: '3px 9px', borderRadius: 99,
              }}>
                EARNED {formatDate(item.earned)}
              </span>
              {item.credential && (
                <a href={item.credential} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: c.light, textDecoration: 'none' }}>
                  Verify ↗
                </a>
              )}
            </>
          )}

          {item.status === 'in_progress' && (
            <>
              <span style={{
                fontFamily: 'JetBrains Mono', fontSize: 8.5, letterSpacing: '0.1em',
                color: c.main, border: `1px dashed ${c.main}`,
                padding: '3px 9px', borderRadius: 99,
              }}>
                {(item.progress?.label || 'In progress').toUpperCase()}
              </span>
              {item.target && (
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9.5, color: '#777' }}>
                  targeting {item.target}
                </span>
              )}
              {item.progress?.detail && (
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9.5, color: '#666' }}>
                  · {item.progress.detail}
                </span>
              )}
            </>
          )}

          {planned && (
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9.5, color: '#5f5f5f' }}>
              Planned{item.target ? ` · ${item.target}` : ''}
            </span>
          )}
        </div>

        {/* The reasoning is the evidence while nothing here is finished yet. */}
        {!earned && item.why && (
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: 12.5, lineHeight: 1.65,
            color: '#8a8a8a', marginTop: 10, maxWidth: 620,
            borderLeft: '1px solid #2a2a2a', paddingLeft: 12,
          }}>
            {item.why}
          </p>
        )}
      </div>
    </div>
  )
}

function YouAreHere() {
  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'center', margin: '2px 0 22px' }}>
      <div style={{ width: 60, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%', background: '#4ade80',
          boxShadow: '0 0 8px rgba(74,222,128,0.8)',
        }} />
      </div>
      <span style={{
        fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '0.18em', color: '#4ade80',
      }}>
        YOU ARE HERE
      </span>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(74,222,128,0.35), transparent)' }} />
    </div>
  )
}

/* ─────────────────────────── log ─────────────────────────── */

function LogRow({ item }) {
  const [imgError, setImgError] = useState(false)
  const c = domainOf(item.topic)
  const hasImage = item.image && !imgError

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '11px 14px', borderRadius: 8,
      border: '1px solid #232323', background: '#0f0f0f',
    }}>
      <div style={{
        width: 34, height: 34, flexShrink: 0, borderRadius: 6, overflow: 'hidden',
        background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${c.main}33`,
      }}>
        {hasImage
          ? <img src={item.image} alt="" onError={() => setImgError(true)}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          : <div style={{ width: 7, height: 7, borderRadius: '50%', background: c.main, opacity: 0.6 }} />}
      </div>

      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{
          fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 500, color: '#dcdcdc',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {item.name}
        </p>
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: 9.5, color: '#6a6a6a', marginTop: 2 }}>
          {item.issuer} · {kindLabel[item.kind] || item.kind} · {formatDate(item.date)}
        </p>
      </div>

      {item.credential && (
        <a href={item.credential} target="_blank" rel="noopener noreferrer"
          style={{ fontFamily: 'JetBrains Mono', fontSize: 9.5, color: c.light, textDecoration: 'none', flexShrink: 0 }}>
          Verify ↗
        </a>
      )}
    </div>
  )
}

/* ─────────────────────────── section ─────────────────────────── */

export default function Certifications({ id, num }) {
  const { data } = useData()
  const ladder = data.credentials?.ladder || []
  const log = data.credentials?.log || []
  if (ladder.length === 0 && log.length === 0) return null

  // The marker sits after the last earned node — that's what turns a map into a position.
  const earnedCount = ladder.filter(c => c.status === 'earned').length
  const sortedLog = [...log].sort((a, b) => String(b.date).localeCompare(String(a.date)))

  return (
    <section id={id} className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6">
        <p className="section-number mb-2">// {num}</p>
        <h2 className="section-title mb-2">Certification Route</h2>
        <p className="font-mono text-xs text-muted mb-12">
          CERT_ROUTE // where the track goes, and why in this order
        </p>

        {ladder.length > 0 && (
          <div style={{
            background: '#0d0d0d', border: '1px solid #232323', borderRadius: 12,
            padding: '32px 28px', marginBottom: 40,
          }}>
            {ladder.map((item, i) => (
              <div key={item.id}>
                {i === earnedCount && <YouAreHere />}
                <LadderNode item={item} isLast={i === ladder.length - 1} />
              </div>
            ))}
            {earnedCount === ladder.length && <YouAreHere />}
          </div>
        )}

        {sortedLog.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#fff', fontWeight: 500 }}>
                Learning log
              </span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#666' }}>
                — coursework and completions, most recent first
              </span>
              <div style={{ flex: 1, height: 1, background: '#232323' }} />
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {sortedLog.map(item => <LogRow key={item.id} item={item} />)}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
