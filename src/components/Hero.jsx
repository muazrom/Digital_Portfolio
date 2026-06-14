import { useData } from '../context/DataContext'

export default function Hero() {
  const { data } = useData()
  const h = data.hero

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ paddingTop: '5.5rem' }}>
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(37,99,235,0.06) 40%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 text-center px-6 w-full max-w-3xl mx-auto" style={{ paddingTop: '2rem' }}>

        {/* Label — no side lines */}
        <div className="mb-10 fade-up fade-up-delay-1">
          <span className="font-mono text-xs tracking-[0.3em] uppercase"
            style={{ color: '#666' }}>
            Personal Digital Workshop
          </span>
        </div>

        {/* Name */}
        <h1 className="font-bold tracking-tight mb-6 fade-up fade-up-delay-2 font-display"
          style={{
            fontSize: 'clamp(56px, 11vw, 112px)',
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, #ffffff 0%, #c0d0ff 40%, #4d7fff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
          {h.name}
        </h1>

        {/* Divider dot */}
        <div className="flex items-center justify-center gap-4 mb-6 fade-up fade-up-delay-3">
          <div style={{ height: 1, width: 48, background: '#2a2a2a' }} />
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#2563eb', boxShadow: '0 0 8px rgba(37,99,235,0.9)', display: 'inline-block' }} />
          <div style={{ height: 1, width: 48, background: '#2a2a2a' }} />
        </div>

        {/* Title */}
        <p className="font-mono mb-8 fade-up fade-up-delay-3" style={{ fontSize: 14, color: '#c0c0c0' }}>
          {h.title}
        </p>

        {/* Bio */}
        <p className="leading-relaxed max-w-lg mx-auto mb-10 fade-up fade-up-delay-4"
          style={{ fontSize: 15, color: '#b8b8b8' }}>
          {h.bio}
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 mb-10 fade-up fade-up-delay-5">
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
            { label: 'STATUS', value: h.status, dot: '#4ade80' },
            { label: 'LOCATION', value: h.location, dot: null },
            { label: 'UNIVERSITY', value: h.university, dot: null },
          ].map((item) => (
            <div key={item.label}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid #222',
                borderRadius: 999,
                padding: '8px 18px',
                cursor: 'default',
              }}
            >
              {item.dot && (
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: item.dot, boxShadow: `0 0 8px ${item.dot}`,
                  animation: 'pulse 2s ease-in-out infinite', flexShrink: 0,
                }} />
              )}
              <span className="font-mono" style={{ fontSize: 9, color: '#888', letterSpacing: '0.12em', marginRight: 4 }}>
                {item.label}
              </span>
              <span className="font-mono" style={{ fontSize: 12, color: '#e0e0e0' }}>
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
          position: 'absolute', width: 10, height: 10,
          borderColor: 'rgba(37,99,235,0.25)', borderStyle: 'solid',
          borderWidth: i === 0 ? '1px 0 0 1px' : i === 1 ? '1px 1px 0 0' : i === 2 ? '0 0 1px 1px' : '0 1px 1px 0',
          ...pos,
        }} />
      ))}
    </section>
  )
}
