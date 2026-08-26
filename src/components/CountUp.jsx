import { useState, useEffect } from 'react'

// Animated integer counter. Extracted from Intro so the console's Metric widgets
// and the boot screen animate identically instead of drifting apart.
export default function CountUp({ to, delay = 0, duration = 850 }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf
    const start = setTimeout(() => {
      const t0 = performance.now()
      const tick = (now) => {
        const progress = Math.min((now - t0) / duration, 1)
        setValue(Math.round(progress * to))
        if (progress < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, delay)
    return () => { clearTimeout(start); cancelAnimationFrame(raf) }
  }, [to, delay, duration])
  return <>{value}</>
}
