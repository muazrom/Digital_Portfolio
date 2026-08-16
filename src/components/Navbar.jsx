import { useEffect, useRef, useState } from 'react'
import { sections } from '../sections'
import { useTheme } from '../context/ThemeContext'
import Icon from './Icon'

// Labels and anchors both come from the section list, so a rename can't
// silently desync the nav href from the section's id.
const links = sections.map(({ id, label }) => ({ id, label }))
const SECRET = '#admin'

const GLASS = {
  background: 'var(--glass)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  boxShadow: 'var(--glass-shadow)',
}

// Shows where the toggle will take you, not where you are — the icon is the
// button's action. Labelled, because on its own that reading is ambiguous.
function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={`flex items-center justify-center w-9 h-9 rounded-full text-muted hover:text-strong hover:bg-overlay/10 transition-colors duration-200 ${className}`}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={15} />
    </button>
  )
}

export default function Navbar() {
  const buffer = useRef('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  // Scroll-spy: highlight the link for whichever section is in view
  useEffect(() => {
    const observed = links
      .map((link) => document.getElementById(link.id))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )
    observed.forEach((section) => observer.observe(section))
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
          <span className="font-mono text-sm tracking-tight flex items-center gap-1 shrink-0 pl-[60px] pr-9">
            <span className="text-muted">muaz</span>
            <span className="text-strong font-semibold">rom</span>
            <span className="text-accent font-semibold">.my</span>
          </span>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-[8px] pr-[18px]">
            {links.map(({ id, label }) => {
              const isActive = active === id
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    style={{ whiteSpace: 'nowrap' }}
                    className={`block font-mono text-xs tracking-wide px-6 py-2.5 rounded-full transition-colors duration-200 ${
                      isActive ? 'bg-accent/25 text-accent' : 'text-muted hover:text-strong hover:bg-overlay/10'
                    }`}
                  >
                    {label}
                  </a>
                </li>
              )
            })}
          </ul>

          {/* One toggle for both layouts: it lands after the links on desktop
              and beside the hamburger on mobile, which is where a thumb is. */}
          <ThemeToggle className="mr-2 md:mr-3" />

          {/* Hamburger — mobile only */}
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex flex-col items-center justify-center gap-[5px] w-10 h-10 mr-2 rounded-full hover:bg-overlay/10 transition-colors duration-200"
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
            {links.map(({ id, label }) => {
              const isActive = active === id
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={() => setOpen(false)}
                    className={`block font-mono text-sm px-4 py-3 rounded-2xl transition-colors duration-200 ${
                      isActive ? 'bg-accent/25 text-accent' : 'text-muted hover:text-strong hover:bg-overlay/10'
                    }`}
                  >
                    {label}
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
    background: 'var(--text)',
    borderRadius: 2,
    transition: 'transform 0.25s ease, opacity 0.25s ease',
  }
  if (!open) return base
  if (i === 0) return { ...base, transform: 'translateY(6.5px) rotate(45deg)' }
  if (i === 1) return { ...base, opacity: 0 }
  return { ...base, transform: 'translateY(-6.5px) rotate(-45deg)' }
}
