import { useData } from '../context/DataContext'

const categoryColor = {
  Award:       { top: '#a0a0b0', label: '#c0c0d0', glow: 'rgba(192,192,210,0.3)' },
  Certificate: { top: '#2563eb', label: '#60a5fa', glow: 'rgba(37,99,235,0.3)' },
  Course:      { top: '#4ade80', label: '#86efac', glow: 'rgba(74,222,128,0.3)' },
  Competition: { top: '#facc15', label: '#fde68a', glow: 'rgba(250,204,21,0.3)' },
}

function BadgeCard({ badge }) {
  const colors = categoryColor[badge.category] || categoryColor['Certificate']

  return (
    <div style={{
      position: 'relative',
      background: '#0f0f0f',
      border: '1px solid #2e2e2e',
      borderRadius: 10,
      overflow: 'hidden',
      transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s',
      cursor: 'default',
      width: 220,
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = colors.top
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = `0 8px 32px ${colors.glow}`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#2e2e2e'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Top colour strip */}
      <div style={{ height: 3, background: colors.top, opacity: 0.9 }} />

      {/* Lanyard hole */}
      <div style={{
        width: 10, height: 10, borderRadius: '50%',
        background: '#0a0a0a', border: `1px solid ${colors.top}`,
        margin: '10px auto 0',
        opacity: 0.6,
      }} />

      {/* Seal */}
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        border: `2px solid ${colors.top}`,
        margin: '12px auto',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        boxShadow: `0 0 16px ${colors.glow}`,
      }}>
        {/* Dashed inner ring */}
        <div style={{
          position: 'absolute', inset: 4,
          borderRadius: '50%',
          border: `1px dashed ${colors.top}`,
          opacity: 0.4,
        }} />
        {/* Category initial */}
        <span style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 20, fontWeight: 700,
          color: colors.label,
        }}>
          {badge.category[0]}
        </span>
      </div>

      {/* Details */}
      <div style={{ padding: '0 18px 20px', textAlign: 'center' }}>
        <p style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 13, fontWeight: 600,
          color: '#e0e0e0', lineHeight: 1.4,
          marginBottom: 6,
        }}>
          {badge.name}
        </p>
        <p style={{
          fontFamily: 'JetBrains Mono', fontSize: 10,
          color: '#888', marginBottom: 4,
        }}>
          {badge.issuer}
        </p>
        <p style={{
          fontFamily: 'JetBrains Mono', fontSize: 9,
          color: '#666',
        }}>
          {badge.date}
        </p>

        {/* Category tag */}
        <div style={{ marginTop: 12 }}>
          <span style={{
            fontFamily: 'JetBrains Mono', fontSize: 9,
            color: colors.label,
            background: `${colors.glow}`,
            border: `1px solid ${colors.top}`,
            padding: '2px 8px', borderRadius: 99,
            opacity: 0.8,
          }}>
            {badge.category.toUpperCase()}
          </span>
        </div>

        {/* Credential link */}
        {badge.credential && (
          <a href={badge.credential} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'block', marginTop: 10,
              fontFamily: 'JetBrains Mono', fontSize: 9,
              color: '#2563eb', textDecoration: 'none',
            }}>
            View Credential ↗
          </a>
        )}
      </div>

      {/* Verified tick */}
      <div style={{
        position: 'absolute', top: 10, right: 10,
        width: 16, height: 16, borderRadius: '50%',
        background: colors.top,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 0.8,
      }}>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M1.5 4L3.5 6L6.5 2" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}

export default function Badges() {
  const { data } = useData()
  const badges = data.badges || []

  if (badges.length === 0) return null

  return (
    <section id="badges" className="py-24 relative">

      <div className="max-w-5xl mx-auto px-6">
        <p className="section-number mb-2">// 06</p>
        <h2 className="section-title mb-2">Badges &amp; Certificates</h2>
        <p className="font-mono text-xs text-muted mb-12">CREDENTIAL_RACK // verified achievements</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
          {badges.map(badge => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </div>
    </section>
  )
}
