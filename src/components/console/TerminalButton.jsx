import { useState } from 'react'

// Bracketed terminal-style CTA. Lifted out of the old Hero so the Overview
// panel reuses the exact button treatment rather than approximating it.
const BRACKET_POS = [
  { top: -1, left: -1, borderWidth: '1.5px 0 0 1.5px' },
  { top: -1, right: -1, borderWidth: '1.5px 1.5px 0 0' },
  { bottom: -1, left: -1, borderWidth: '0 0 1.5px 1.5px' },
  { bottom: -1, right: -1, borderWidth: '0 1.5px 1.5px 0' },
]

export default function TerminalButton({ href, children, primary, external }) {
  const [hover, setHover] = useState(false)
  const bracketColor = hover ? 'rgba(96,165,250,1)' : 'rgba(37,99,235,0.35)'

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative font-mono text-xs"
      style={{
        letterSpacing: '0.1em',
        padding: '13px 26px',
        color: primary ? '#fff' : (hover ? '#fff' : '#999'),
        background: primary
          ? `linear-gradient(135deg, rgba(37,99,235,${hover ? 1 : 0.85}), rgba(37,99,235,${hover ? 0.85 : 0.6}))`
          : (hover ? 'rgba(37,99,235,0.08)' : 'rgba(255,255,255,0.015)'),
        border: `1px solid ${primary ? 'rgba(96,165,250,0.6)' : (hover ? 'rgba(37,99,235,0.5)' : 'rgba(255,255,255,0.1)')}`,
        boxShadow: primary
          ? `0 0 ${hover ? 32 : 20}px rgba(37,99,235,${hover ? 0.5 : 0.3})`
          : (hover ? '0 0 16px rgba(37,99,235,0.15)' : 'none'),
        transition: 'color 0.2s, background 0.2s, border-color 0.2s, box-shadow 0.2s',
      }}
    >
      {BRACKET_POS.map((pos, i) => (
        <span key={i} style={{
          position: 'absolute', width: 8, height: 8,
          borderStyle: 'solid', borderColor: bracketColor,
          transition: 'border-color 0.2s',
          ...pos,
        }} />
      ))}
      <span style={{ opacity: 0.6, marginRight: 8 }}>{'>'}</span>{children}
    </a>
  )
}
