import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

export default function DoorFrame({ leftRef, rightRef, doorsOpen }) {
  const arcRef = useRef(null)

  // Electric arc pulses along the door seam while closed
  useEffect(() => {
    if (doorsOpen) return
    const pulse = () => {
      if (!arcRef.current) return
      gsap.to(arcRef.current, {
        opacity: 0.6 + Math.random() * 0.4,
        scaleY: 0.95 + Math.random() * 0.1,
        duration: 0.05 + Math.random() * 0.1,
        ease: 'none',
        onComplete: () => setTimeout(pulse, 60 + Math.random() * 200),
      })
    }
    pulse()
  }, [doorsOpen])

  return (
    <div style={styles.frameWrap}>
      {/* Outer frame — heavy industrial border */}
      <div style={styles.outerFrame}>

        {/* Corner bolts */}
        {['topLeft','topRight','bottomLeft','bottomRight'].map(pos => (
          <Bolt key={pos} position={pos} />
        ))}

        {/* Top lintel label */}
        <div style={styles.lintel}>
          <span style={styles.lintelText}>DIGITAL ARTIFACTS FORGERY</span>
          <span style={styles.lintelSub}>// RESTRICTED ACCESS · ZONE Ø</span>
        </div>

        {/* Door panels */}
        <div style={styles.doorArea}>
          {/* Left door panel */}
          <div ref={leftRef} style={{ ...styles.door, ...styles.doorLeft }}>
            <DoorSurface side="left" />
          </div>

          {/* Right door panel */}
          <div ref={rightRef} style={{ ...styles.door, ...styles.doorRight }}>
            <DoorSurface side="right" />
          </div>

          {/* Electric seam between doors */}
          <div ref={arcRef} style={styles.seam}>
            <SeamArc />
          </div>

          {/* Forge interior glow — visible through seam */}
          <div style={styles.interiorGlow} />
        </div>

        {/* Floor threshold */}
        <div style={styles.threshold}>
          <span style={styles.thresholdText}>▓▓▓ CAUTION · AUTHORIZED PERSONNEL ONLY ▓▓▓</span>
        </div>
      </div>
    </div>
  )
}

function DoorSurface({ side }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Horizontal rivet lines */}
      {[0.15, 0.35, 0.55, 0.75, 0.9].map((y, i) => (
        <div key={i} style={{
          position: 'absolute', left: 0, right: 0,
          top: `${y * 100}%`,
          height: 1,
          background: 'linear-gradient(90deg, transparent, #2a2a2a 20%, #2a2a2a 80%, transparent)',
        }} />
      ))}
      {/* Rivets */}
      {[0.15, 0.35, 0.55, 0.75, 0.9].map((y, i) => (
        [0.15, 0.85].map((x, j) => (
          <Rivet key={`${i}-${j}`} top={`${y * 100}%`} left={`${x * 100}%`} />
        ))
      ))}
      {/* Warning stripes at bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 24,
        background: `repeating-linear-gradient(
          -45deg,
          #1a1a1a 0px, #1a1a1a 8px,
          #2a1a00 8px, #2a1a00 16px
        )`,
        opacity: 0.7,
      }} />
      {/* Door number */}
      <div style={{
        position: 'absolute', top: '50%', [side === 'left' ? 'right' : 'left']: 20,
        transform: 'translateY(-50%)',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 64, fontWeight: 700,
        color: 'rgba(37,99,235,0.08)',
        letterSpacing: '-0.05em',
        userSelect: 'none',
      }}>
        {side === 'left' ? 'DA' : 'F'}
      </div>
    </div>
  )
}

function Rivet({ top, left }) {
  return (
    <div style={{
      position: 'absolute', top, left,
      width: 6, height: 6, borderRadius: '50%',
      background: 'radial-gradient(circle at 35% 35%, #555, #1a1a1a)',
      border: '1px solid #333',
      transform: 'translate(-50%, -50%)',
    }} />
  )
}

function Bolt({ position }) {
  const map = {
    topLeft:     { top: 8, left: 8 },
    topRight:    { top: 8, right: 8 },
    bottomLeft:  { bottom: 8, left: 8 },
    bottomRight: { bottom: 8, right: 8 },
  }
  return (
    <div style={{
      position: 'absolute', ...map[position],
      width: 12, height: 12, borderRadius: '50%',
      background: 'radial-gradient(circle at 35% 35%, #888, #222)',
      border: '1px solid #555',
      zIndex: 2,
    }} />
  )
}

function SeamArc() {
  return (
    <svg width="4" height="100%" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="arcGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {Array.from({ length: 20 }).map((_, i) => {
        const y1 = (i / 20) * 100
        const y2 = ((i + 1) / 20) * 100
        const jitter = (Math.random() - 0.5) * 3
        return (
          <line key={i}
            x1="2" y1={`${y1}%`}
            x2={2 + jitter} y2={`${y2}%`}
            stroke="#2563eb" strokeWidth="1.5"
            filter="url(#arcGlow)"
            opacity={0.4 + Math.random() * 0.6}
          />
        )
      })}
    </svg>
  )
}

const styles = {
  frameWrap: {
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  outerFrame: {
    position: 'relative',
    width: 'min(640px, 90vw)',
    height: 'min(760px, 88vh)',
    border: '3px solid #2a2a2a',
    background: '#0a0a0a',
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 0 60px rgba(37,99,235,0.08), inset 0 0 40px rgba(0,0,0,0.8)',
  },
  lintel: {
    padding: '10px 20px',
    borderBottom: '2px solid #1a1a1a',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: '#0d0d0d',
    flexShrink: 0,
  },
  lintelText: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 11, fontWeight: 700,
    letterSpacing: '0.2em',
    color: '#2563eb',
  },
  lintelSub: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 9, color: '#444',
    letterSpacing: '0.1em',
  },
  doorArea: {
    flex: 1, position: 'relative',
    display: 'flex', overflow: 'hidden',
  },
  door: {
    position: 'absolute', top: 0, bottom: 0,
    width: '50%',
    background: '#111',
    borderTop: '1px solid #2a2a2a',
    overflow: 'hidden',
  },
  doorLeft:  { left: 0,  borderRight: '1px solid #1a1a1a' },
  doorRight: { right: 0, borderLeft:  '1px solid #1a1a1a' },
  seam: {
    position: 'absolute', top: 0, bottom: 0,
    left: '50%', transform: 'translateX(-50%)',
    width: 4, zIndex: 5,
  },
  interiorGlow: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse at 50% 40%, rgba(37,99,235,0.15) 0%, transparent 60%)',
    pointerEvents: 'none', zIndex: 1,
  },
  threshold: {
    padding: '8px 20px',
    borderTop: '2px solid #1a1a1a',
    background: '#0a0a0a',
    flexShrink: 0,
    textAlign: 'center',
  },
  thresholdText: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 8, letterSpacing: '0.15em',
    color: '#3a2500',
  },
}
