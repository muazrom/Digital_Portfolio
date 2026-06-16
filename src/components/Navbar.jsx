import { useEffect, useRef, useState } from 'react'

const links = ['About', 'Skills', 'Projects', 'Experience', 'Badges', 'Contact']
const SECRET = '#admin'

export default function Navbar() {
  const buffer = useRef('')
  const [open, setOpen] = useState(false)

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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border"
      style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)', maxWidth: '100vw', overflow: 'hidden' }}>
      <nav className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-4" style={{ minWidth: 0 }}>
        <span className="font-mono text-sm tracking-tight flex items-center gap-1 shrink-0">
          <span className="text-muted">muaz</span>
          <span className="text-white font-semibold">rom</span>
          <span className="text-accent font-semibold">.my</span>
        </span>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                className="font-mono text-xs text-muted hover:text-white transition-colors duration-200 relative group"
              >
                {link}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-200" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 shrink-0">
          {/* Resume — visible on desktop; lives inside the mobile menu otherwise */}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-block font-mono text-xs border border-accent/50 text-accent px-3 py-1.5 hover:bg-accent hover:text-white hover:border-accent transition-all duration-200"
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
            className="md:hidden flex flex-col items-center justify-center gap-[5px] w-9 h-9 border border-border hover:border-accent transition-colors duration-200"
          >
            <span style={barStyle(open, 0)} />
            <span style={barStyle(open, 1)} />
            <span style={barStyle(open, 2)} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
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
          {links.map((link, i) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-4 border-b border-border font-mono text-sm text-muted hover:text-white transition-colors duration-200"
              >
                <span>{link}</span>
                <span className="text-accent text-xs">// {String(i + 1).padStart(2, '0')}</span>
              </a>
            </li>
          ))}
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
    </header>
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
