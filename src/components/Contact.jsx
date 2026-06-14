const channels = [
  { freq: '144.200', label: 'EMAIL', value: 'zaumarief08@gmail.com', href: 'mailto:zaumarief08@gmail.com', status: 'LIVE' },
  { freq: '446.006', label: 'WHATSAPP', value: '+60 17-897 2218', href: 'https://wa.me/60178972218', status: 'LIVE' },
  { freq: '27.185', label: 'GITHUB', value: 'github.com/muazrom', href: 'https://github.com/muazrom', status: 'LIVE' },
  { freq: '868.300', label: 'LINKEDIN', value: 'linkedin.com/in/muazrom', href: 'https://linkedin.com/in/muazrom', status: 'LIVE' },
]

function SignalBars() {
  const heights = [4, 7, 11, 8, 5, 9, 6, 10, 4, 8]
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 14 }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          width: 2, height: h, background: '#2563eb', borderRadius: 1,
          animation: `bar-pulse ${0.6 + i * 0.07}s ease-in-out infinite alternate`,
          animationDelay: `${i * 0.05}s`,
        }} />
      ))}
    </div>
  )
}

function FreqChannel({ ch }) {
  return (
    <a href={ch.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: 8,
          padding: '14px 20px', display: 'grid',
          gridTemplateColumns: '90px 1fr auto', alignItems: 'center', gap: 20,
          transition: 'border-color 0.2s, background 0.2s', cursor: 'pointer',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(37,99,235,0.4)'; e.currentTarget.style.background = 'rgba(37,99,235,0.03)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.background = '#0d0d0d' }}
      >
        <div>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#444', marginBottom: 3, letterSpacing: '0.1em' }}>FREQ (MHz)</p>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: 14, color: '#2563eb', fontWeight: 500 }}>{ch.freq}</p>
        </div>
        <div>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#444', marginBottom: 3, letterSpacing: '0.1em' }}>{ch.label}</p>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, color: '#ccc', fontWeight: 500 }}>{ch.value}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80', animation: 'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#4ade80' }}>{ch.status}</span>
          </div>
          <SignalBars />
        </div>
      </div>
    </a>
  )
}

export default function Contact() {
  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6">
        <p className="section-number mb-2">// 07</p>
        <h2 className="section-title mb-2">Contact</h2>
        <p className="font-mono text-xs text-muted mb-10">
          TRANSMISSION_PANEL // all channels live · internship open from <span className="text-white">Aug 2026</span>
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 640 }}>
          {channels.map(ch => <FreqChannel key={ch.label} ch={ch} />)}
        </div>
      </div>
      <style>{`
        @keyframes bar-pulse {
          from { transform: scaleY(0.4); opacity: 0.6; }
          to   { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </section>
  )
}
