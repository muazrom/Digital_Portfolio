import { useState, useRef, useCallback } from 'react'

const projects = [
  {
    name: 'Noctua',
    description: 'AI-driven personal assistant & life management dashboard. Features natural language journaling, proactive data tracking, and intelligent goal planning with LangGraph-powered contextual AI workflows.',
    stack: ['React', 'Python', 'SQLite', 'LangGraph', 'Tailwind CSS'],
    github: 'https://github.com/muazrom',
    live: null,
    status: 'In Development',
  },
  {
    name: 'Archive',
    description: 'AI-native unified file system & hybrid search engine. Combines local storage with web intelligence for hyper-personalized information retrieval using vector databases.',
    stack: ['React', 'Electron', 'Python', 'ChromaDB', 'Brave API'],
    github: 'https://github.com/muazrom',
    live: null,
    status: 'Ongoing',
  },
  {
    name: 'VISSCO',
    description: 'Web-based attendance management system for students and lecturers. Built for the Pre-University Innovation Competition with CRUD operations, secure login, and password encryption.',
    stack: ['HTML', 'CSS', 'JavaScript', 'SQLite'],
    github: 'https://github.com/muazrom',
    live: null,
    status: 'Completed',
  },
  {
    name: 'Digital Portfolio',
    description: 'This site — a personal dashboard-style portfolio themed as a digital workshop. Built with React + Vite, deployed on Cloudflare Pages with a custom domain.',
    stack: ['React', 'Vite', 'Tailwind CSS', 'Cloudflare'],
    github: 'https://github.com/muazrom/Digital_Portfolio',
    live: 'https://muazrom.my',
    status: 'Live',
  },
]

const statusColor = {
  Live: '#4ade80',
  'In Development': '#facc15',
  Ongoing: '#60a5fa',
  Completed: '#888',
}

const CARD_W = 280
const CARD_H = 360
const RADIUS = 340
const PERSPECTIVE = 1000

export default function Projects() {
  const [index, setIndex] = useState(0)
  const total = projects.length
  const angleStep = 360 / total

  // rotation in degrees so card `index` faces front (0 = front)
  const rotation = -index * angleStep

  const prev = () => setIndex(i => (i - 1 + total) % total)
  const next = () => setIndex(i => (i + 1) % total)

  // Scroll-wheel over carousel rotates it
  const wheelAccum = useRef(0)
  const onWheel = useCallback((e) => {
    e.preventDefault()
    wheelAccum.current += e.deltaY
    if (wheelAccum.current > 60) { next(); wheelAccum.current = 0 }
    else if (wheelAccum.current < -60) { prev(); wheelAccum.current = 0 }
  }, [])

  // Touch swipe
  const touchX = useRef(null)
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current === null) return
    const diff = touchX.current - e.changedTouches[0].clientX
    if (diff > 40) next()
    else if (diff < -40) prev()
    touchX.current = null
  }

  const p = projects[index]

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.4), transparent)' }}
      />

      <div className="max-w-5xl mx-auto px-6 mb-10">
        <p className="section-number mb-2">// 04</p>
        <div className="flex items-end justify-between">
          <h2 className="section-title">Projects</h2>
          <span className="font-mono text-xs text-muted">
            {String(index + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(total).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* 3D scene */}
      <div
        className="relative mx-auto"
        style={{ width: CARD_W, height: CARD_H, perspective: PERSPECTIVE }}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotation}deg)`,
            transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
          }}
        >
          {projects.map((proj, i) => {
            const cardAngle = angleStep * i
            const distFromFront = Math.min(
              Math.abs(i - index),
              total - Math.abs(i - index)
            )

            return (
              <div
                key={proj.name}
                onClick={() => setIndex(i)}
                style={{
                  position: 'absolute',
                  width: CARD_W,
                  height: CARD_H,
                  transform: `rotateY(${cardAngle}deg) translateZ(${RADIUS}px)`,
                  backfaceVisibility: 'hidden',
                  cursor: distFromFront === 0 ? 'default' : 'pointer',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: distFromFront === 0
                      ? 'linear-gradient(160deg, #161616 0%, #111 100%)'
                      : '#0f0f0f',
                    border: `1px solid ${distFromFront === 0 ? 'rgba(37,99,235,0.5)' : '#1e1e1e'}`,
                    borderRadius: 12,
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    boxShadow: distFromFront === 0
                      ? '0 0 40px rgba(37,99,235,0.15), 0 20px 60px rgba(0,0,0,0.6)'
                      : '0 8px 32px rgba(0,0,0,0.4)',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {/* Top glow on active */}
                  {distFromFront === 0 && (
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0,
                      height: 2,
                      background: 'linear-gradient(90deg, transparent, #2563eb, transparent)',
                    }} />
                  )}

                  {/* Status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: statusColor[proj.status],
                      boxShadow: `0 0 6px ${statusColor[proj.status]}`,
                      flexShrink: 0,
                    }} />
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: statusColor[proj.status] }}>
                      {proj.status}
                    </span>
                  </div>

                  {/* Name */}
                  <div>
                    <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>
                      {proj.name}
                    </h3>
                    <p style={{ fontSize: 12.5, color: '#666', lineHeight: 1.6 }}>
                      {proj.description}
                    </p>
                  </div>

                  {/* Stack */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto' }}>
                    {proj.stack.map(tech => (
                      <span key={tech} style={{
                        fontFamily: 'JetBrains Mono',
                        fontSize: 9.5,
                        background: 'rgba(37,99,235,0.07)',
                        border: '1px solid rgba(37,99,235,0.15)',
                        color: '#666',
                        padding: '2px 8px',
                        borderRadius: 3,
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div style={{ display: 'flex', gap: 16, paddingTop: 12, borderTop: '1px solid #1e1e1e' }}>
                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#555' }}
                        onMouseEnter={e => e.target.style.color = '#2563eb'}
                        onMouseLeave={e => e.target.style.color = '#555'}
                      >
                        GitHub ↗
                      </a>
                    )}
                    {proj.live && (
                      <a
                        href={proj.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#555' }}
                        onMouseEnter={e => e.target.style.color = '#2563eb'}
                        onMouseLeave={e => e.target.style.color = '#555'}
                      >
                        Live ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-6 mt-10">
        <button
          onClick={prev}
          className="w-8 h-8 border border-border flex items-center justify-center text-muted hover:border-accent hover:text-accent transition-all duration-200 font-mono text-xs"
        >
          ←
        </button>

        <div className="flex items-center gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              style={{
                height: 5,
                width: index === i ? 20 : 5,
                borderRadius: index === i ? 3 : '50%',
                background: index === i ? '#2563eb' : '#2a2a2a',
                transition: 'all 0.25s ease',
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-8 h-8 border border-border flex items-center justify-center text-muted hover:border-accent hover:text-accent transition-all duration-200 font-mono text-xs"
        >
          →
        </button>
      </div>
    </section>
  )
}
