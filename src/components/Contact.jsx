const channels = [
  {
    id: 'CH_01',
    label: 'EMAIL',
    value: 'zaumarief08@gmail.com',
    href: 'mailto:zaumarief08@gmail.com',
    hint: 'Fastest response',
  },
  {
    id: 'CH_02',
    label: 'WHATSAPP',
    value: '+60 17-897 2218',
    href: 'https://wa.me/60178972218',
    hint: 'Direct message',
  },
  {
    id: 'CH_03',
    label: 'GITHUB',
    value: 'github.com/muazrom',
    href: 'https://github.com/muazrom',
    hint: 'See the work',
  },
  {
    id: 'CH_04',
    label: 'LINKEDIN',
    value: 'linkedin.com/in/muazrom',
    href: 'https://linkedin.com/in/muazrom',
    hint: 'Professional profile',
  },
]

function ChannelCard({ ch }) {
  return (
    <a
      href={ch.href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}
    >
      <div
        style={{
          background: '#0f0f0f',
          border: '1px solid #1e1e1e',
          borderRadius: 10,
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(37,99,235,0.5)'
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(37,99,235,0.08)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#1e1e1e'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Channel ID */}
          <span style={{
            fontFamily: 'JetBrains Mono', fontSize: 9,
            color: '#2563eb', background: 'rgba(37,99,235,0.08)',
            border: '1px solid rgba(37,99,235,0.2)',
            padding: '3px 8px', borderRadius: 3,
            flexShrink: 0,
          }}>
            {ch.id}
          </span>

          <div>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#444', marginBottom: 4, letterSpacing: '0.1em' }}>
              {ch.label}
            </p>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 500, color: '#ddd' }}>
              {ch.value}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#333' }}>
            {ch.hint}
          </span>
          <span style={{ color: '#2a2a2a', fontSize: 16, lineHeight: 1 }}>↗</span>
        </div>
      </div>
    </a>
  )
}

export default function Contact() {
  return (
    <section id="contact" className="py-24 relative">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.4), transparent)' }}
      />

      <div className="max-w-5xl mx-auto px-6">
        <p className="section-number mb-2">// 07</p>
        <h2 className="section-title mb-2">Contact</h2>
        <p className="font-mono text-xs text-muted mb-12">
          Open to internships from <span className="text-white">Aug 2026</span> · available across all channels below
        </p>

        {/* ── Channels ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 48 }}>
          {channels.map(ch => <ChannelCard key={ch.id} ch={ch} />)}
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
          <div style={{ flex: 1, height: 1, background: '#1a1a1a' }} />
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#333', letterSpacing: '0.15em' }}>
            OR SEND A MESSAGE
          </span>
          <div style={{ flex: 1, height: 1, background: '#1a1a1a' }} />
        </div>

        {/* ── Form ── */}
        <div style={{ maxWidth: 560 }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 12 }} onSubmit={e => e.preventDefault()}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { placeholder: 'Name', type: 'text' },
                { placeholder: 'Email', type: 'email' },
              ].map(f => (
                <input key={f.placeholder} type={f.type} placeholder={f.placeholder}
                  style={{
                    background: '#0d0d0d', border: '1px solid #1e1e1e',
                    borderRadius: 6, padding: '11px 14px',
                    color: '#fff', fontSize: 13, outline: 'none',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(37,99,235,0.5)'}
                  onBlur={e => e.target.style.borderColor = '#1e1e1e'}
                />
              ))}
            </div>
            <textarea
              placeholder="Message"
              rows={4}
              style={{
                background: '#0d0d0d', border: '1px solid #1e1e1e',
                borderRadius: 6, padding: '11px 14px',
                color: '#fff', fontSize: 13, outline: 'none',
                resize: 'vertical', fontFamily: 'inherit',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(37,99,235,0.5)'}
              onBlur={e => e.target.style.borderColor = '#1e1e1e'}
            />
            <div>
              <button type="submit" style={{
                background: '#2563eb', color: '#fff', border: 'none',
                borderRadius: 6, padding: '11px 28px',
                fontFamily: 'JetBrains Mono', fontSize: 12,
                cursor: 'pointer', letterSpacing: '0.06em',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
                onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}
              >
                SEND →
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
