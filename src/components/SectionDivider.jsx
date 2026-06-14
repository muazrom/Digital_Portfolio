import { useEffect, useRef } from 'react'

export default function SectionDivider({ index, label }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add('divider-visible')
        else el.classList.remove('divider-visible')
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      maxWidth: 1024,
      margin: '0 auto',
      gap: 0,
      userSelect: 'none',
      pointerEvents: 'none',
    }}>
      {/* Left line — blue fades in from pill outward to transparent */}
      <div className="divider-line-left" style={{
        flex: 1, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.6))',
        boxShadow: '0 0 6px rgba(37,99,235,0.25)',
      }} />

      {/* Center pill */}
      <div className="divider-pill divider-scan" style={{
        display: 'flex', alignItems: 'center', gap: 10,
        border: '1px solid rgba(37,99,235,0.45)',
        borderRadius: 4,
        padding: '5px 14px',
        background: '#0d0d0d',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 14px rgba(37,99,235,0.18)',
      }}>
        <span style={{
          fontFamily: 'JetBrains Mono', fontSize: 8,
          color: '#2563eb', letterSpacing: '0.15em',
        }}>
          {String(index).padStart(2, '0')}
        </span>
        <span style={{ width: 1, height: 10, background: 'rgba(37,99,235,0.3)' }} />
        <span style={{
          fontFamily: 'JetBrains Mono', fontSize: 8,
          color: '#aaa', letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          {label}
        </span>
      </div>

      {/* Right line — blue fades out from pill to transparent */}
      <div className="divider-line-right" style={{
        flex: 1, height: 1,
        background: 'linear-gradient(90deg, rgba(37,99,235,0.6), transparent)',
        boxShadow: '0 0 6px rgba(37,99,235,0.25)',
      }} />
    </div>
  )
}
