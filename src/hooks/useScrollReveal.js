import { useEffect, useRef } from 'react'

export function useScrollReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        // Reveal once and stop observing — for sections taller than the viewport (e.g. the
        // mobile Projects grid), the intersection ratio crosses the threshold multiple times
        // while scrolling through, and removing the class mid-scroll restarted the fade
        // transition from 0 every time, leaving it stuck at a low opacity.
        if (entry.isIntersecting) {
          el.classList.add('in-view')
          obs.unobserve(el)
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}
