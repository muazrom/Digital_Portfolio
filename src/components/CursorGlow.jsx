import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const glowRef = useRef(null)
  const target = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const current = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })

  useEffect(() => {
    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove)

    let raf
    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * 0.07
      current.current.y += (target.current.y - current.current.y) * 0.07
      if (glowRef.current) {
        glowRef.current.style.transform =
          `translate(${current.current.x - 250}px, ${current.current.y - 250}px)`
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
    <div
      ref={glowRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.13) 0%, rgba(37,99,235,0.05) 45%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 3,
        willChange: 'transform',
      }}
    />
  )
}
