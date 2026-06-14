import { useEffect, useRef } from 'react'

export default function SectionDivider({ index, label }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('divider-visible')
        } else {
          el.classList.remove('divider-visible')
        }
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
      gap: 16,
      userSelect: 'none',
      pointerEvents: 'none',
    }}>
      {/* Left line */}
      <div className="divider-line-left" style={{
        flex: 1, height: 1,
        background: 'linear-gradient(90deg, transparent, #252525)',
      }} />

      {/* Center pill with scan flash */}
      <div className="divider-pill divider-scan" style={{
        display: 'flex', alignItems: 'center', gap: 10,
        border: '1px solid #1e1e1e',
        borderRadius: 4,
        padding: '5px 14px',
        background: '#0d0d0d',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <span style={{
          fontFamily: 'JetBrains Mono', fontSize: 8,
          color: '#2563eb', letterSpacing: '0.15em',
        }}>
          {String(index).padStart(2, '0')}
        </span>
        <span style={{ width: 1, height: 10, background: '#1e1e1e' }} />
        <span style={{
          fontFamily: 'JetBrains Mono', fontSize: 8,
          color: '#777', letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          {label}
        </span>
      </div>

      {/* Right line */}
      <div className="divider-line-right" style={{
        flex: 1, height: 1,
        background: 'linear-gradient(90deg, #252525, transparent)',
      }} />
    </div>
  )
}
