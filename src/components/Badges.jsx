import { useState } from 'react'
import { useData } from '../context/DataContext'

// Tier defines the medal design + colour. 1 = professional exam cert, 2 = course, 3 = learning, 'award' = award (no rank).
const tierMeta = {
  1:       { label: 'Professional', roman: 'I',   main: '#2563eb', light: '#93b4ff', dark: '#0e1f4d', glow: 'rgba(37,99,235,0.35)' },
  2:       { label: 'Course',       roman: 'II',  main: '#22c55e', light: '#86efac', dark: '#0f3d23', glow: 'rgba(34,197,94,0.30)' },
  3:       { label: 'Learning',     roman: 'III', main: '#9ca3af', light: '#d4d8df', dark: '#2a2d33', glow: 'rgba(156,163,175,0.28)' },
  award:   { label: 'Award',        roman: '★',   main: '#f59e0b', light: '#fcd34d', dark: '#5a3a0a', glow: 'rgba(245,158,11,0.32)' },
}

// Sort order: certs by tier (1→3), then awards last.
const orderOf = (tier) => (tier === 'award' ? 4 : (tier || 2))

const SIZE = 224

// Hexagonal medal — colour + symbol signal the tier (roman numeral for certs, ★ for awards).
function Medal({ tier, size = 66 }) {
  const t = tierMeta[tier] || tierMeta[2]
  const gid = `medal-grad-${tier}`
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 10px ${t.glow})` }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t.main} />
          <stop offset="100%" stopColor={t.dark} />
        </linearGradient>
      </defs>
      <path d="M50 3 L91 26 L91 74 L50 97 L9 74 L9 26 Z" fill={`url(#${gid})`} stroke={t.light} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M50 16 L80 33 L80 67 L50 84 L20 67 L20 33 Z" fill="none" stroke={t.light} strokeWidth="1" strokeDasharray="3 4" opacity="0.45" />
      <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
        fontFamily="Space Grotesk, sans-serif" fontSize={tier === 'award' ? 34 : 30} fontWeight="700" fill="#fff" letterSpacing="-1">
        {t.roman}
      </text>
    </svg>
  )
}

function BadgeCard({ badge, isTouch }) {
  const [flipped, setFlipped] = useState(false)
  const [imgError, setImgError] = useState(false)
  const t = tierMeta[badge.tier] || tierMeta[2]
  const hasImage = badge.image && !imgError

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
          {/* Tier colour strip */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: t.main, opacity: 0.9 }} />

          <div style={{ marginTop: 8 }}><Medal tier={badge.tier} /></div>

          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13.5, fontWeight: 600, color: '#eaeaea', lineHeight: 1.3, marginTop: 12,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {badge.name}
          </p>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: 9.5, color: '#888', marginTop: 5 }}>{badge.issuer}</p>

          {/* Tier chip */}
          <div style={{ marginTop: 'auto', paddingTop: 10 }}>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 8.5, letterSpacing: '0.1em', color: t.light,
              background: t.glow, border: `1px solid ${t.main}`, padding: '3px 9px', borderRadius: 99, opacity: 0.9 }}>
              {badge.tier === 'award' ? 'AWARD' : `TIER ${t.roman} · ${t.label.toUpperCase()}`}
            </span>
          </div>

          {/* Flip affordance */}
          <span style={{ position: 'absolute', bottom: 8, right: 10, fontFamily: 'JetBrains Mono', fontSize: 8, color: '#555' }}>
            {isTouch ? 'tap ⟳' : 'hover ⟳'}
          </span>
        </div>

        {/* ───── BACK ───── */}
        <div style={{ ...faceBase, transform: 'rotateY(180deg)', display: 'flex', flexDirection: 'column' }}>
          {hasImage ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', padding: 12 }}>
              <img src={badge.image} alt={badge.name} onError={() => setImgError(true)}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: `radial-gradient(circle at 50% 40%, ${t.glow}, #0a0a0a 70%)` }}>
              <Medal tier={badge.tier} size={52} />
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#777', textAlign: 'center', padding: '0 18px' }}>
                Image coming soon
              </p>
            </div>
          )}

          {/* Link bar */}
          <div style={{ borderTop: `1px solid ${t.main}`, padding: '10px 14px', textAlign: 'center', background: '#0d0d0d' }}>
            {badge.credential ? (
              <a href={badge.credential} target="_blank" rel="noopener noreferrer"
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

export default function Badges() {
  const { data } = useData()
  const badges = data.badges || []
  if (badges.length === 0) return null

  const isTouch = typeof window !== 'undefined' &&
    window.matchMedia('(hover: none), (pointer: coarse)').matches

  // Sort by tier (1 → 3, then awards); keep insertion order within a group.
  const sorted = [...badges].sort((a, b) => orderOf(a.tier) - orderOf(b.tier))

  return (
    <section id="badges" className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6">
        <p className="section-number mb-2">// 06</p>
        <h2 className="section-title mb-2">Badges &amp; Certificates</h2>
        <p className="font-mono text-xs text-muted mb-12">CREDENTIAL_RACK // {isTouch ? 'tap a card to flip' : 'hover a card to flip'}</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
          {sorted.map(badge => (
            <BadgeCard key={badge.id} badge={badge} isTouch={isTouch} />
          ))}
        </div>
      </div>
    </section>
  )
}
