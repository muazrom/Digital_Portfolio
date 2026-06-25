import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export default function LockPanel({ lines, bootDone }) {
  const panelRef = useRef(null)
  const progressRef = useRef(null)
  const ledRef = useRef(null)
  const [progress, setProgress] = useState(0)

  // Drive progress bar as lines come in
  useEffect(() => {
    const pct = Math.min((lines.length / 9) * 100, 100)
    setProgress(pct)
    if (progressRef.current) {
      gsap.to(progressRef.current, { width: `${pct}%`, duration: 0.3, ease: 'power1.out' })
    }
  }, [lines.length])

  // LED flicker while booting, solid green when done
  useEffect(() => {
    if (!ledRef.current) return
    if (bootDone) {
      gsap.to(ledRef.current, { background: '#4ade80', boxShadow: '0 0 10px #4ade80', duration: 0.3 })
      return
    }
    const flicker = () => {
      if (!ledRef.current) return
      const on = Math.random() > 0.3
      ledRef.current.style.background = on ? '#2563eb' : '#111'
      ledRef.current.style.boxShadow = on ? '0 0 8px #2563eb' : 'none'
      setTimeout(flicker, 80 + Math.random() * 200)
    }
    flicker()
  }, [bootDone])

  // Panel shake on boot complete
  useEffect(() => {
    if (!bootDone || !panelRef.current) return
    gsap.to(panelRef.current, {
      x: '+=3', duration: 0.05, repeat: 6, yoyo: true, ease: 'none',
      onComplete: () => gsap.set(panelRef.current, { x: 0 }),
    })
  }, [bootDone])

  return (
    <div ref={panelRef} style={styles.panel}>
      {/* Lock icon / keyhole */}
      <div style={styles.lockHead}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="14" width="24" height="16" rx="2" fill="#1a1a1a" stroke="#2563eb" strokeWidth="1.5"/>
          <path d="M10 14V10a6 6 0 0 1 12 0v4" stroke="#2563eb" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <circle cx="16" cy="21" r="2.5" fill="#2563eb" opacity="0.8"/>
          <rect x="15" y="21" width="2" height="4" rx="1" fill="#2563eb" opacity="0.6"/>
        </svg>
        <div ref={ledRef} style={styles.led} />
      </div>

      {/* Terminal output */}
      <div style={styles.terminal}>
        <div style={styles.terminalInner}>
          {lines.map((line, i) => (
            <TerminalLine key={i} text={line} isLast={i === lines.length - 1} />
          ))}
          {!bootDone && <BlinkCursor />}
        </div>
      </div>

      {/* Progress bar */}
      <div style={styles.progressTrack}>
        <div style={styles.progressLabel}>
          <span>BOOT SEQUENCE</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div style={styles.progressBar}>
          <div ref={progressRef} style={{ ...styles.progressFill, width: '0%' }} />
          <div style={styles.progressGlow} />
        </div>
      </div>

      {/* Panel screws */}
      <Screw pos={{ top: 6, left: 6 }} />
      <Screw pos={{ top: 6, right: 6 }} />
      <Screw pos={{ bottom: 6, left: 6 }} />
      <Screw pos={{ bottom: 6, right: 6 }} />
    </div>
  )
}

function TerminalLine({ text, isLast }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        setDone(true)
        clearInterval(interval)
      }
    }, 18)
    return () => clearInterval(interval)
  }, [text])

  const isOk    = text.includes('[OK]')
  const isReady = text.includes('[READY]')
  const color = isOk ? '#4ade80' : isReady ? '#2563eb' : '#a1a1aa'

  return (
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color, lineHeight: 1.8, whiteSpace: 'pre' }}>
      {displayed}
    </div>
  )
}

function BlinkCursor() {
  const ref = useRef(null)
  useEffect(() => {
    gsap.to(ref.current, { opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: 'none' })
  }, [])
  return <span ref={ref} style={{ color: '#2563eb', fontFamily: 'monospace', fontSize: 10 }}>█</span>
}

function Screw({ pos }) {
  return (
    <div style={{
      position: 'absolute', ...pos,
      width: 8, height: 8, borderRadius: '50%',
      background: 'radial-gradient(circle at 35% 35%, #666, #222)',
      border: '1px solid #444',
    }} />
  )
}

const styles = {
  panel: {
    position: 'absolute',
    zIndex: 20,
    left: '50%', top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 280,
    background: '#0d0d0d',
    border: '1px solid #2563eb44',
    borderRadius: 4,
    padding: '20px 16px 16px',
    boxShadow: '0 0 30px rgba(37,99,235,0.2), 0 0 4px rgba(37,99,235,0.4)',
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  lockHead: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottom: '1px solid #1f1f1f',
  },
  led: {
    width: 8, height: 8, borderRadius: '50%',
    background: '#111',
    transition: 'background 0.1s',
  },
  terminal: {
    background: '#080808',
    border: '1px solid #1a1a1a',
    borderRadius: 2,
    padding: '8px 10px',
    minHeight: 160,
    maxHeight: 160,
    overflowY: 'auto',
  },
  terminalInner: {
    display: 'flex', flexDirection: 'column',
  },
  progressTrack: {
    display: 'flex', flexDirection: 'column', gap: 5,
  },
  progressLabel: {
    display: 'flex', justifyContent: 'space-between',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 8, color: '#555', letterSpacing: '0.1em',
  },
  progressBar: {
    position: 'relative',
    height: 3, background: '#1a1a1a', borderRadius: 2, overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #1d4ed8, #2563eb)',
    borderRadius: 2,
    position: 'relative', zIndex: 1,
  },
  progressGlow: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(90deg, transparent 60%, rgba(37,99,235,0.4))',
    pointerEvents: 'none',
  },
}
