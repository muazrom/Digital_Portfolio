import { useEffect, useRef, useState } from 'react'

const links = ['About', 'Skills', 'Projects', 'Experience', 'Badges', 'Contact']
const SECRET = '#admin'

const GLASS = {
  background: 'linear-gradient(135deg, rgba(37,99,235,0.22), rgba(37,99,235,0.06))',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  boxShadow: '0 8px 32px rgba(37,99,235,0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
}

export default function Navbar() {
  const buffer = useRef('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  // Scroll-spy: highlight the link for whichever section is in view
  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.toLowerCase()))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      // Ignore if user is typing in an input/textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return

      buffer.current = (buffer.current + e.key).slice(-SECRET.length)
      if (buffer.current === SECRET) {
        buffer.current = ''
        window.location.hash = 'admin'
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close the menu on Escape
  useEffect(() => {
    if (!open) return
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [open])

  return (
    <>
      <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav
          className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-accent/30"
          style={GLASS}
        >
          <span className="font-mono text-sm tracking-tight flex items-center gap-1 shrink-0 pl-10 pr-6">
            <span className="text-muted">muaz</span>
            <span className="text-white font-semibold">rom</span>
            <span className="text-accent font-semibold">.my</span>
          </span>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-2.5 pr-3">
            {links.map((link) => {
              const isActive = active === link.toLowerCase()
              return (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className={`block font-mono text-xs tracking-wide px-6 py-2.5 rounded-full transition-colors duration-200 ${
                      isActive ? 'bg-accent/25 text-accent' : 'text-muted hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link}
                  </a>
                </li>
              )
            })}
          </ul>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex flex-col items-center justify-center gap-[5px] w-10 h-10 mr-2 rounded-full hover:bg-white/10 transition-colors duration-200"
          >
            <span style={barStyle(open, 0)} />
            <span style={barStyle(open, 1)} />
            <span style={barStyle(open, 2)} />
          </button>
        </nav>
      </div>

      {/* Mobile floating glass dropdown */}
      <div
        className="md:hidden fixed top-20 right-4 left-4 z-40"
        style={{
          transform: open ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.97)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
          transformOrigin: 'top center',
        }}
      >
        <div className="rounded-3xl border border-accent/30 overflow-hidden" style={GLASS}>
          <ul className="flex flex-col p-2">
            {links.map((link) => {
              const isActive = active === link.toLowerCase()
              return (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    onClick={() => setOpen(false)}
                    className={`block font-mono text-sm px-4 py-3 rounded-2xl transition-colors duration-200 ${
                      isActive ? 'bg-accent/25 text-accent' : 'text-muted hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </>
  )
}

// Animated hamburger → X
function barStyle(open, i) {
  const base = {
    display: 'block',
    width: 18,
    height: 1.5,
    background: '#fff',
    borderRadius: 2,
    transition: 'transform 0.25s ease, opacity 0.25s ease',
  }
  if (!open) return base
  if (i === 0) return { ...base, transform: 'translateY(6.5px) rotate(45deg)' }
  if (i === 1) return { ...base, opacity: 0 }
  return { ...base, transform: 'translateY(-6.5px) rotate(-45deg)' }
}
