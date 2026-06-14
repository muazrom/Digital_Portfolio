import { useState, useEffect, useRef, useMemo } from 'react'

const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*[]{}|<>/\\_-+=~;:.,?'
const randChar = () => POOL[Math.floor(Math.random() * POOL.length)]
const rand = (a, b) => Math.random() * (b - a) + a

const N = 200

const BOOT_LINES = [
  { text: 'WORKSHOP_OS v1.0.0 — booting...', color: '#2563eb' },
  { text: 'loading environment variables... OK', color: '#888' },
  { text: 'mounting filesystem... OK',           color: '#888' },
  { text: 'initializing modules... OK',          color: '#888' },
  { text: 'establishing connection... OK',       color: '#888' },
  { text: 'Welcome. The workshop is open.',      color: '#e0e0e0' },
]

function TypedLine({ text, color }) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    let i = 0
    const t = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(t)
    }, 42) // slower typing
    return () => clearInterval(t)
  }, [text])
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
      <span style={{ color: '#2563eb', fontFamily: 'JetBrains Mono', fontSize: 13, flexShrink: 0 }}>›</span>
      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color, lineHeight: 1.7 }}>
        {displayed}
        {displayed.length < text.length && <span style={{ color: '#2563eb' }}>▋</span>}
      </span>
    </div>
  )
}

export default function BootIntro({ onDone }) {
  const [chaos, setChaos] = useState(true)
  const [chars, setChars] = useState(() => Array.from({ length: N }, randChar))
  const [visibleLines, setVisibleLines] = useState(0)
  const [fading, setFading] = useState(false)
  const intervalRef = useRef(null)

  // Each particle gets its own random fade delay and duration for organic stagger
  const particles = useMemo(() => Array.from({ length: N }, (_, i) => ({
    id: i,
    x: rand(0.5, 99.5),
    y: rand(1, 99),
    size: rand(9, 26),
    color: [
      `rgba(37,99,235,${rand(0.3, 0.95).toFixed(2)})`,
      `rgba(100,140,255,${rand(0.25, 0.75).toFixed(2)})`,
      `rgba(60,60,60,${rand(0.4, 0.8).toFixed(2)})`,
      `rgba(37,99,235,${rand(0.15, 0.5).toFixed(2)})`,
    ][Math.floor(Math.random() * 4)],
    fadeDelay: Math.round(rand(0, 2800)),   // spread fade-out over 2.8s
    fadeDuration: Math.round(rand(300, 800)), // each fades at its own speed
  })), [])

  // Cycle chars continuously
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setChars(Array.from({ length: N }, randChar))
    }, 60)
    return () => clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    // After 2.8s start the staggered fade-out
    const tChaos = setTimeout(() => setChaos(false), 2800)

    // Keep chars cycling for 1.5s into the fade so they're still changing as they disappear
    const tStop = setTimeout(() => clearInterval(intervalRef.current), 4300)

    // Boot lines — appear slowly, spaced well apart
    const lineDelays = [3800, 5100, 6100, 6950, 7750, 8700]
    const lineTimers = lineDelays.map((d, i) =>
      setTimeout(() => setVisibleLines(i + 1), d)
    )

    // Auto-dismiss after last line has had time to finish typing
    const tFade = setTimeout(() => {
      setFading(true)
      setTimeout(onDone, 700)
    }, 11500)

    return () => {
      clearTimeout(tChaos)
      clearTimeout(tStop)
      lineTimers.forEach(clearTimeout)
      clearTimeout(tFade)
    }
  }, [])

  const skip = () => {
    setFading(true)
    setTimeout(onDone, 400)
  }

  return (
    <div
      onClick={skip}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#030303',
        overflow: 'hidden',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.7s ease',
        cursor: 'pointer',
      }}
    >
      {/* Faint grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(37,99,235,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Chaos characters — each fades independently */}
      {particles.map((p, i) => (
        <span key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`,
          top: `${p.y}%`,
          fontFamily: 'JetBrains Mono',
          fontSize: p.size,
          color: p.color,
          opacity: chaos ? 1 : 0,
          transform: chaos
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, -50%) scale(0.2)',
          transition: `opacity ${p.fadeDuration}ms ease ${p.fadeDelay}ms, transform ${p.fadeDuration + 100}ms ease ${p.fadeDelay}ms`,
          userSelect: 'none',
          pointerEvents: 'none',
          willChange: 'opacity, transform',
        }}>
          {chars[i]}
        </span>
      ))}

      {/* Center content — fades in as chaos clears */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: 540, width: '90%',
        opacity: chaos ? 0 : 1,
        transition: 'opacity 0.8s ease 1s',
      }}>
        <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#2563eb',
            boxShadow: '0 0 14px rgba(37,99,235,1)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#2563eb', letterSpacing: '0.25em' }}>
            MUAZROM · PERSONAL DIGITAL WORKSHOP
          </span>
        </div>

        <div>
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <TypedLine key={i} text={line.text} color={line.color} />
          ))}
        </div>

        {visibleLines > 0 && (
          <div style={{ marginTop: 32, fontFamily: 'JetBrains Mono', fontSize: 9, color: '#444', letterSpacing: '0.2em' }}>
            TAP ANYWHERE TO SKIP
          </div>
        )}
      </div>
    </div>
  )
}
