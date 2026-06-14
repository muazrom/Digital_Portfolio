import { useEffect, useRef } from 'react'

const links = ['About', 'Skills', 'Projects', 'Experience', 'Badges', 'Contact']
const SECRET = '#admin'

export default function Navbar() {
  const buffer = useRef('')

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50"
      style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)' }}>
      <nav className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-4 border-b border-border">
        <span className="font-mono text-sm tracking-tight flex items-center gap-1 shrink-0">
          <span className="text-muted">muaz</span>
          <span className="text-white font-semibold">rom</span>
          <span className="text-accent font-semibold">.my</span>
        </span>
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
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs border border-accent/50 text-accent px-3 py-1.5 hover:bg-accent hover:text-white hover:border-accent transition-all duration-200 shrink-0"
          style={{ boxShadow: '0 0 12px rgba(37,99,235,0.15)' }}
        >
          Resume ↗
        </a>
      </nav>

      {/* Workshop banner divider */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: 0,
        borderBottom: '1px solid rgba(37,99,235,0.08)',
      }}>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.5))' }} />
        <span style={{
          fontFamily: 'JetBrains Mono', fontSize: 8,
          color: '#555', letterSpacing: '0.2em',
          textTransform: 'uppercase',
          padding: '4px 14px',
          border: '1px solid rgba(37,99,235,0.2)',
          borderRadius: 3,
          background: '#0a0a0a',
          boxShadow: '0 0 10px rgba(37,99,235,0.1)',
          flexShrink: 0,
        }}>
          Personal Digital Workshop
        </span>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(37,99,235,0.5), transparent)' }} />
      </div>
    </header>
  )
}
