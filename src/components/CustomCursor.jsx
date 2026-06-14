import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const target = useRef({ x: -100, y: -100 })
  const ring = useRef({ x: -100, y: -100 })
  const hovering = useRef(false)

  useEffect(() => {
    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY }
      hovering.current = !!e.target.closest('a, button, [role="button"]')
    }

    window.addEventListener('mousemove', onMove)

    let raf
    const animate = () => {
      ring.current.x += (target.current.x - ring.current.x) * 0.1
      ring.current.y += (target.current.y - ring.current.y) * 0.1

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${target.current.x}px, ${target.current.y}px)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`
        // Morph on hover
        if (hovering.current) {
          ringRef.current.style.width = '44px'
          ringRef.current.style.height = '44px'
          ringRef.current.style.borderColor = 'rgba(37,99,235,0.9)'
          ringRef.current.style.backgroundColor = 'rgba(37,99,235,0.08)'
        } else {
          ringRef.current.style.width = '30px'
          ringRef.current.style.height = '30px'
          ringRef.current.style.borderColor = 'rgba(37,99,235,0.55)'
          ringRef.current.style.backgroundColor = 'transparent'
        }
      }

      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* Inner dot — exact position */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 5, height: 5,
          borderRadius: '50%',
          background: '#2563eb',
          boxShadow: '0 0 6px rgba(37,99,235,0.9)',
          transform: 'translate(-100px, -100px)',
          marginLeft: -2.5, marginTop: -2.5,
          pointerEvents: 'none',
          zIndex: 9998,
          willChange: 'transform',
        }}
      />

      {/* Outer ring — lagged */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 30, height: 30,
          borderRadius: '50%',
          border: '1px solid rgba(37,99,235,0.55)',
          transform: 'translate(-100px, -100px)',
          marginLeft: -15, marginTop: -15,
          pointerEvents: 'none',
          zIndex: 9997,
          willChange: 'transform',
          transition: 'width 0.2s ease, height 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
        }}
      />
    </>
  )
}
