import { useState } from 'react'
import { useData } from '../context/DataContext'

// `kind` drives the medal design and the card label — one field, not the old
// `tier`, which mixed credential rigor with artifact type and needed a sort shim
// to untangle. 'certification' is reserved for exam-based certs; when CCNA lands
// it renders at top weight automatically, visibly distinct from a course badge.
const kindMeta = {
  certification: { label: 'Certification',  roman: 'I',   sides: 7, main: '#2563eb', light: '#93b4ff', dark: '#0e1f4d', glow: 'rgba(37,99,235,0.35)' },
  path:          { label: 'Learning path',  roman: 'II',  sides: 6, main: '#22c55e', light: '#86efac', dark: '#0f3d23', glow: 'rgba(34,197,94,0.30)' },
  course:        { label: 'Course',         roman: 'II',  sides: 6, main: '#22c55e', light: '#86efac', dark: '#0f3d23', glow: 'rgba(34,197,94,0.30)' },
  module:        { label: 'Module',         roman: 'III', sides: 5, main: '#9ca3af', light: '#d4d8df', dark: '#2a2d33', glow: 'rgba(156,163,175,0.28)' },
}
const metaOf = (kind) => kindMeta[kind] || kindMeta.course

// Regular polygon, point-up, inset slightly so the stroke isn't clipped.
const polygonPath = (sides) =>
  Array.from({ length: sides }, (_, i) => {
    const a = (Math.PI * 2 * i) / sides - Math.PI / 2
    return `${(50 + 47 * Math.cos(a)).toFixed(2)} ${(50 + 47 * Math.sin(a)).toFixed(2)}`
  }).map((p, i) => `${i ? 'L' : 'M'}${p}`).join(' ') + ' Z'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const formatDate = (iso) => {
  if (!iso) return ''
  const [y, m] = String(iso).split('-')
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : y
}

const SIZE = 224

function Medal({ kind, size = 88 }) {
  const t = metaOf(kind)
  const gid = `medal-grad-${kind}`
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 10px ${t.glow})` }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t.main} />
          <stop offset="100%" stopColor={t.dark} />
        </linearGradient>
      </defs>
      <path d={polygonPath(t.sides)} fill={`url(#${gid})`} stroke={t.light} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="50" cy="50" r="30" fill="none" stroke={t.light} strokeWidth="1" strokeDasharray="3 4" opacity="0.45" />
      <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
        fontFamily="Space Grotesk, sans-serif" fontSize="32" fontWeight="700" fill="#fff" letterSpacing="-1">
        {t.roman}
      </text>
    </svg>
  )
}

function CredentialCard({ item, isTouch }) {
  const [flipped, setFlipped] = useState(false)
  const [imgError, setImgError] = useState(false)
  const t = metaOf(item.kind)
  const hasImage = item.image && !imgError

  const flipHandlers = isTouch
    ? { onClick: () => setFlipped(f => !f) }
    : { onMouseEnter: () => setFlipped(true), onMouseLeave: () => setFlipped(false) }

  const faceBase = {
    position: 'absolute', inset: 0,
    backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
    borderRadius: 12, overflow: 'hidden',
    border: `1px solid ${flipped ? t.main : '#2a2a2a'}`,
    background: '#0f0f0f',
    transition: 'border-color 0.3s',
  }

  return (
    <div style={{ width: SIZE, height: SIZE, perspective: 1000, cursor: isTouch ? 'pointer' : 'default' }} {...flipHandlers}>
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>
        {/* ───── FRONT ───── */}
        <div style={{ ...faceBase, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '14px 16px' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: t.main, opacity: 0.9 }} />

          <div style={{ marginTop: 2 }}><Medal kind={item.kind} /></div>

          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13.5, fontWeight: 600, color: '#eaeaea', lineHeight: 1.3, marginTop: 8,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {item.name}
          </p>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: 9.5, color: '#888', marginTop: 5 }}>{item.issuer}</p>

          <div style={{ marginTop: 'auto', paddingTop: 10 }}>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 8.5, letterSpacing: '0.1em', color: t.light,
              background: t.glow, border: `1px solid ${t.main}`, padding: '3px 9px', borderRadius: 99, opacity: 0.9 }}>
              {t.label.toUpperCase()}{item.date ? ` · ${formatDate(item.date)}` : ''}
            </span>
          </div>

          <span style={{ position: 'absolute', bottom: 8, right: 10, fontFamily: 'JetBrains Mono', fontSize: 8, color: '#555' }}>
            {isTouch ? 'tap ⟳' : 'hover ⟳'}
          </span>
        </div>

        {/* ───── BACK ───── */}
        <div style={{ ...faceBase, transform: 'rotateY(180deg)', display: 'flex', flexDirection: 'column' }}>
          {hasImage ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', padding: 12 }}>
              <img src={item.image} alt={item.name} onError={() => setImgError(true)}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: `radial-gradient(circle at 50% 40%, ${t.glow}, #0a0a0a 70%)` }}>
              <Medal kind={item.kind} size={68} />
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#777', textAlign: 'center', padding: '0 18px' }}>
                Image coming soon
              </p>
            </div>
          )}

          <div style={{ borderTop: `1px solid ${t.main}`, padding: '10px 14px', textAlign: 'center', background: '#0d0d0d' }}>
            {item.credential ? (
              <a href={item.credential} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{ fontFamily: 'JetBrains Mono', fontSize: 10.5, color: t.light, textDecoration: 'none' }}>
                Verify credential ↗
              </a>
            ) : (
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9.5, color: '#555' }}>No public link</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Credentials({ id, num }) {
  const { data } = useData()
  const items = data.credentials || []
  if (items.length === 0) return null

  const isTouch = typeof window !== 'undefined' &&
    window.matchMedia('(hover: none), (pointer: coarse)').matches

  // Most recent first. No prestige ordering — these are completions, not a ranking.
  const sorted = [...items].sort((a, b) => String(b.date).localeCompare(String(a.date)))

  return (
    <section id={id} className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6">
        <p className="section-number mb-2">// {num}</p>
        <h2 className="section-title mb-2">Learning &amp; Credentials</h2>
        <p className="font-mono text-xs text-muted mb-12">
          CREDENTIAL_RACK // {isTouch ? 'tap a card to flip' : 'hover a card to flip'}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
          {sorted.map(item => (
            <CredentialCard key={item.id} item={item} isTouch={isTouch} />
          ))}
        </div>
      </div>
    </section>
  )
}
