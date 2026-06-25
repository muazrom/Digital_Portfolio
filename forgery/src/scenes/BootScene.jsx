import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import LockPanel from '../components/LockPanel'
import DoorFrame from '../components/DoorFrame'

const BOOT_LINES = [
  '> INITIALIZING FORGERY OS v3.1.4...',
  '> CHECKING VAULT INTEGRITY............[OK]',
  '> CALIBRATING ARC CONDUITS...........[OK]',
  '> LOADING ARTIFACT REGISTRY..........[OK]',
  '> AUTHENTICATING OPERATOR............[OK]',
  '> BYPASSING EXTERNAL SENSORS.........[OK]',
  '> D3C0D1NG L0CK SEQU3NCE.............█▓░',
  '> HYDRAULIC BOLTS DISENGAGED.........[READY]',
  '> OPENING GATES.',
]

export default function BootScene({ phase, onEnter, onInside }) {
  const [lines, setLines] = useState([])
  const [bootDone, setBootDone] = useState(false)
  const [doorsOpen, setDoorsOpen] = useState(false)
  const overlayRef = useRef(null)
  const leftDoorRef = useRef(null)
  const rightDoorRef = useRef(null)

  // Type out boot lines one by one
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[i]])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setBootDone(true), 600)
      }
    }, 320)
    return () => clearInterval(interval)
  }, [])

  // Once boot is done, open doors then transition
  useEffect(() => {
    if (!bootDone) return
    setDoorsOpen(true)
    onEnter()

    const tl = gsap.timeline({ onComplete: onInside })

    // Doors slide open (xPercent = translateX as % of own width)
    tl.to(leftDoorRef.current,  { xPercent: -100, duration: 1.4, ease: 'power3.inOut' }, 0.3)
    tl.to(rightDoorRef.current, { xPercent:  100, duration: 1.4, ease: 'power3.inOut' }, 0.3)

    // Fade entire boot scene after doors clear
    tl.to(overlayRef.current, { opacity: 0, duration: 0.7, ease: 'power2.in' }, '+=0.15')

    return () => tl.kill()
  }, [bootDone])

  return (
    <div ref={overlayRef} style={styles.root}>
      {/* Ambient voltage flicker overlay */}
      <VoltageFlicker />

      {/* Door frame — the exterior of the forgery */}
      <DoorFrame leftRef={leftDoorRef} rightRef={rightDoorRef} doorsOpen={doorsOpen} />

      {/* Lock panel sits center on the door seam */}
      <LockPanel lines={lines} bootDone={bootDone} />
    </div>
  )
}

function VoltageFlicker() {
  const ref = useRef(null)
  useEffect(() => {
    const flicker = () => {
      if (!ref.current) return
      const opacity = Math.random() > 0.93 ? 0.06 + Math.random() * 0.08 : 0
      ref.current.style.opacity = opacity
      setTimeout(flicker, 40 + Math.random() * 120)
    }
    flicker()
  }, [])

  return (
    <div ref={ref} style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
      background: 'radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.4) 0%, transparent 70%)',
      opacity: 0,
    }} />
  )
}

const styles = {
  root: {
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#050505',
    zIndex: 100,
    overflow: 'hidden',
  },
}
