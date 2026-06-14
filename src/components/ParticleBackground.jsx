import { useEffect, useRef } from 'react'

const SPEED = 0.3
const CONNECT_DIST = 170

export default function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    let pts = []

    const init = () => {
      const W = window.innerWidth
      // Cover full scrollable page height
      const H = Math.max(document.documentElement.scrollHeight, window.innerHeight)
      canvas.width = W
      canvas.height = H

      // Scale particle count with page area, capped at 130
      const N = Math.min(Math.round(80 * (H / window.innerHeight)), 130)
      pts = Array.from({ length: N }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r: Math.random() * 1.6 + 0.6,
      }))
    }

    // Small delay so page is fully laid out before measuring scrollHeight
    const initTimer = setTimeout(init, 100)
    window.addEventListener('resize', init)

    const tick = () => {
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      for (const p of pts) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
      }

      // Connection lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < CONNECT_DIST) {
            const alpha = (1 - d / CONNECT_DIST) * 0.5
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(37,99,235,${alpha.toFixed(3)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      // Dots
      for (const p of pts) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(37,99,235,0.65)'
        ctx.fill()
      }

      raf = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      clearTimeout(initTimer)
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', init)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
