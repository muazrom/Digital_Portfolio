import { useEffect, useRef, useState } from 'react'

const links = ['About', 'Skills', 'Projects', 'Experience', 'Badges', 'Contact']
const SECRET = '#admin'

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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-dashed border-border"
      style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)', maxWidth: '100vw', overflow: 'hidden' }}>
      <nav className="relative max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-4" style={{ minWidth: 0 }}>
        {/* Corner tick marks — blueprint crop marks */}
        <CornerTicks />

        <span className="font-mono text-sm tracking-tight flex items-center gap-1 shrink-0">
          <span className="text-muted">muaz</span>
          <span className="text-white font-semibold">rom</span>
          <span className="text-accent font-semibold">.my</span>
        </span>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center divide-x divide-dashed divide-border">
          {links.map((link) => {
            const isActive = active === link.toLowerCase()
            return (
              <li key={link} className="px-4 first:pl-0 last:pr-0">
                <a
                  href={`#${link.toLowerCase()}`}
                  className={`font-mono text-xs tracking-wide transition-colors duration-200 relative ${
                    isActive ? 'text-accent' : 'text-muted hover:text-white'
                  }`}
                >
                  <span className="text-[9px] mr-1 opacity-50">{isActive ? '▸' : '·'}</span>
                  {link}
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-0 w-full h-px bg-accent" />
                  )}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-3 shrink-0">
          {/* Resume — visible on desktop; lives inside the mobile menu otherwise */}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-block font-mono text-xs border border-dashed border-accent/50 text-accent px-3 py-1.5 hover:border-solid hover:bg-accent hover:text-white hover:border-accent transition-all duration-200"
            style={{ boxShadow: '0 0 12px rgba(37,99,235,0.15)' }}
          >
            Resume ↗
          </a>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex flex-col items-center justify-center gap-[5px] w-9 h-9 border border-dashed border-border hover:border-solid hover:border-accent transition-colors duration-200"
          >
            <span style={barStyle(open, 0)} />
            <span style={barStyle(open, 1)} />
            <span style={barStyle(open, 2)} />
          </button>
        </div>
      </nav>
    </header>

    {/* Mobile menu overlay — rendered as a header sibling; header's backdropFilter
        would otherwise establish a containing block and collapse this fixed panel */}
    <div
      className="md:hidden"
      style={{
        position: 'fixed',
        top: 56, left: 0, right: 0, bottom: 0,
        background: 'rgba(10,10,10,0.97)',
        backdropFilter: 'blur(12px)',
        transform: open ? 'translateY(0)' : 'translateY(-8px)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
        zIndex: 40,
      }}
    >
        <ul className="flex flex-col px-6 py-4">
          {links.map((link, i) => {
            const isActive = active === link.toLowerCase()
            return (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between py-4 border-b border-dashed border-border font-mono text-sm transition-colors duration-200 ${
                    isActive ? 'text-accent' : 'text-muted hover:text-white'
                  }`}
                >
                  <span>{link}</span>
                  <span className="text-accent text-xs">// {String(i + 1).padStart(2, '0')}</span>
                </a>
              </li>
            )
          })}
        </ul>
        <div className="px-6 pt-2">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="block text-center font-mono text-sm border border-accent/50 text-accent px-4 py-3 hover:bg-accent hover:text-white transition-all duration-200"
            style={{ boxShadow: '0 0 12px rgba(37,99,235,0.15)' }}
          >
            Resume ↗
          </a>
        </div>
    </div>
    </>
  )
}

// Blueprint-style corner crop marks framing the nav bar
function CornerTicks() {
  const size = 8
  const positions = [
    { top: 0, left: 0, borderTop: '1px solid', borderLeft: '1px solid' },
    { top: 0, right: 0, borderTop: '1px solid', borderRight: '1px solid' },
    { bottom: 0, left: 0, borderBottom: '1px solid', borderLeft: '1px solid' },
    { bottom: 0, right: 0, borderBottom: '1px solid', borderRight: '1px solid' },
  ]
  return (
    <>
      {positions.map((pos, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="hidden md:block absolute border-accent/40"
          style={{ ...pos, width: size, height: size, pointerEvents: 'none' }}
        />
      ))}
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
