import { useData } from '../context/DataContext'

export default function Hero() {
  const { data } = useData()
  const h = data.hero

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-14 overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)' }} />
      </div>

      {/* Horizontal rule lines — top and bottom of content */}
      <div className="absolute left-0 right-0 pointer-events-none"
        style={{ top: '50%', transform: 'translateY(-220px)', height: 1, background: 'linear-gradient(90deg, transparent, #2a2a2a 20%, #2a2a2a 80%, transparent)' }} />
      <div className="absolute left-0 right-0 pointer-events-none"
        style={{ top: '50%', transform: 'translateY(220px)', height: 1, background: 'linear-gradient(90deg, transparent, #2a2a2a 20%, #2a2a2a 80%, transparent)' }} />

      <div className="relative z-10 text-center px-6 w-full max-w-3xl mx-auto">

        {/* Label */}
        <p className="font-mono text-xs text-muted mb-10 tracking-[0.3em] uppercase fade-up fade-up-delay-1">
          Personal Digital Workshop
        </p>

        {/* Name — the monolith */}
        <h1 className="font-bold tracking-tight mb-6 fade-up fade-up-delay-2"
          style={{
            fontSize: 'clamp(52px, 10vw, 96px)',
            lineHeight: 1,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, #ffffff 0%, #a0b4ff 50%, #2563eb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
          {h.name}
        </h1>

        {/* Divider with accent */}
        <div className="flex items-center justify-center gap-4 mb-6 fade-up fade-up-delay-3">
          <div style={{ height: 1, width: 48, background: '#2a2a2a' }} />
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#2563eb', boxShadow: '0 0 8px rgba(37,99,235,0.9)', display: 'inline-block' }} />
          <div style={{ height: 1, width: 48, background: '#2a2a2a' }} />
        </div>

        {/* Title */}
        <p className="font-mono text-sm text-muted mb-8 fade-up fade-up-delay-3">
          {h.title}
        </p>

        {/* Bio */}
        <p className="text-muted leading-relaxed max-w-lg mx-auto mb-12 fade-up fade-up-delay-4"
          style={{ fontSize: 14 }}>
          {h.bio}
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 mb-16 fade-up fade-up-delay-5">
          <a href="#projects"
            className="bg-accent text-white font-mono text-xs px-6 py-3 hover:bg-blue-600 transition-colors duration-200"
            style={{ letterSpacing: '0.08em' }}>
            VIEW PROJECTS
          </a>
          <a href="#contact"
            className="font-mono text-xs text-muted px-6 py-3 border border-border hover:border-accent hover:text-white transition-all duration-200"
            style={{ letterSpacing: '0.08em' }}>
            CONTACT
          </a>
        </div>

        {/* Stat pills */}
        <div className="flex items-center justify-center flex-wrap gap-3 fade-up fade-up-delay-5">
          {[
            { label: 'STATUS', value: h.status, dot: '#4ade80', offset: 0 },
            { label: 'LOCATION', value: h.location, dot: null, offset: 6 },
            { label: 'UNIVERSITY', value: h.university, dot: null, offset: -4 },
          ].map((item) => (
            <div key={item.label}
              className="group"
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid #222',
                borderRadius: 999,
                padding: '8px 18px',
                transform: `translateY(${item.offset}px)`,
                transition: 'border-color 0.3s, transform 0.3s',
                cursor: 'default',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(37,99,235,0.4)'; e.currentTarget.style.transform = `translateY(${item.offset - 2}px)` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.transform = `translateY(${item.offset}px)` }}
            >
              {item.dot && (
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: item.dot,
                  boxShadow: `0 0 8px ${item.dot}`,
                  animation: 'pulse 2s ease-in-out infinite',
                  flexShrink: 0,
                }} />
              )}
              <span className="font-mono" style={{ fontSize: 9, color: '#444', letterSpacing: '0.12em', marginRight: 6 }}>
                {item.label}
              </span>
              <span className="font-mono" style={{ fontSize: 11, color: '#999' }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Corner markers */}
      {[
        { top: 80, left: 24 }, { top: 80, right: 24 },
        { bottom: 24, left: 24 }, { bottom: 24, right: 24 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 10, height: 10,
          borderColor: 'rgba(37,99,235,0.25)',
          borderStyle: 'solid',
          borderWidth: i === 0 ? '1px 0 0 1px' : i === 1 ? '1px 1px 0 0' : i === 2 ? '0 0 1px 1px' : '0 1px 1px 0',
          ...pos,
        }} />
      ))}

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 fade-up fade-up-delay-5">
        <span className="font-mono text-xs" style={{ color: '#2a2a2a', letterSpacing: '0.2em', fontSize: 9 }}>SCROLL</span>
        <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, #2563eb, transparent)' }} />
      </div>
    </section>
  )
}
