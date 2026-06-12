import { useState, useRef, useCallback } from 'react'
import { useData } from '../context/DataContext'

const statusColor = {
  Live: '#4ade80', 'In Development': '#facc15', Ongoing: '#60a5fa', Completed: '#888',
}

const CARD_W = 280
const CARD_H = 380

function getCardStyle(rel) {
  const abs = Math.abs(rel)
  const sign = rel >= 0 ? 1 : -1
  if (abs === 0) return { transform: 'translateX(0px) rotateY(0deg) scale(1)', opacity: 1, zIndex: 10, pointerEvents: 'auto' }
  if (abs === 1) return { transform: `translateX(${sign * 220}px) rotateY(${sign * -42}deg) scale(0.82)`, opacity: 0.55, zIndex: 5, pointerEvents: 'auto' }
  return { transform: `translateX(${sign * 340}px) rotateY(${sign * -55}deg) scale(0.68)`, opacity: 0, zIndex: 1, pointerEvents: 'none' }
}

export default function Projects() {
  const { data } = useData()
  const projects = data.projects
  const [index, setIndex] = useState(0)
  const total = projects.length

  const safeIndex = Math.min(index, total - 1)

  const prev = () => setIndex(i => (i - 1 + total) % total)
  const next = () => setIndex(i => (i + 1) % total)

  const wheelAccum = useRef(0)
  const onWheel = useCallback((e) => {
    e.preventDefault()
    wheelAccum.current += e.deltaY
    if (wheelAccum.current > 60) { next(); wheelAccum.current = 0 }
    else if (wheelAccum.current < -60) { prev(); wheelAccum.current = 0 }
  }, [total])

  const touchX = useRef(null)
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current === null) return
    const diff = touchX.current - e.changedTouches[0].clientX
    if (diff > 40) next()
    else if (diff < -40) prev()
    touchX.current = null
  }

  if (total === 0) return null

  return (
    <section id="projects" className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.4), transparent)' }} />
      <div className="max-w-5xl mx-auto px-6 mb-14">
        <p className="section-number mb-2">// 04</p>
        <div className="flex items-end justify-between">
          <h2 className="section-title">Projects</h2>
          <span className="font-mono text-xs text-muted">
            {String(safeIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(total).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="relative mx-auto" style={{ width: CARD_W, height: CARD_H, perspective: 1200, perspectiveOrigin: '50% 40%' }}
        onWheel={onWheel} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {projects.map((proj, i) => {
          let rel = i - safeIndex
          if (rel > total / 2) rel -= total
          if (rel < -total / 2) rel += total
          const style = getCardStyle(rel)
          const isActive = rel === 0

          return (
            <div key={proj.id} onClick={() => !isActive && setIndex(i)} style={{
              position: 'absolute', width: CARD_W, height: CARD_H,
              transformStyle: 'preserve-3d', transformOrigin: 'center center',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease',
              cursor: isActive ? 'default' : 'pointer', ...style,
            }}>
              <div style={{
                width: '100%', height: '100%',
                background: isActive ? 'linear-gradient(160deg, #161616 0%, #111 100%)' : '#0f0f0f',
                border: `1px solid ${isActive ? 'rgba(37,99,235,0.5)' : '#1a1a1a'}`,
                borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 12,
                boxShadow: isActive ? '0 0 40px rgba(37,99,235,0.15), 0 24px 64px rgba(0,0,0,0.7)' : '0 8px 24px rgba(0,0,0,0.5)',
                overflow: 'hidden', position: 'relative',
              }}>
                {isActive && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #2563eb, transparent)' }} />}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor[proj.status], boxShadow: `0 0 6px ${statusColor[proj.status]}`, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: statusColor[proj.status] }}>{proj.status}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 10 }}>{proj.name}</h3>
                  <p style={{ fontSize: 12.5, color: '#666', lineHeight: 1.65 }}>{proj.description}</p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {proj.stack.map(tech => (
                    <span key={tech} style={{ fontFamily: 'JetBrains Mono', fontSize: 9.5, background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.15)', color: '#666', padding: '2px 8px', borderRadius: 3 }}>{tech}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 16, paddingTop: 12, borderTop: '1px solid #1e1e1e' }}>
                  {proj.github && <a href={proj.github} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#555' }} onMouseEnter={e => e.currentTarget.style.color = '#2563eb'} onMouseLeave={e => e.currentTarget.style.color = '#555'}>GitHub ↗</a>}
                  {proj.live && <a href={proj.live} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#555' }} onMouseEnter={e => e.currentTarget.style.color = '#2563eb'} onMouseLeave={e => e.currentTarget.style.color = '#555'}>Live ↗</a>}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-center gap-6 mt-16">
        <button onClick={prev} className="w-8 h-8 border border-border flex items-center justify-center text-muted hover:border-accent hover:text-accent transition-all duration-200 font-mono text-xs">←</button>
        <div className="flex items-center gap-2">
          {projects.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} style={{ height: 5, width: safeIndex === i ? 20 : 5, borderRadius: safeIndex === i ? 3 : '50%', background: safeIndex === i ? '#2563eb' : '#2a2a2a', transition: 'all 0.25s ease' }} />
          ))}
        </div>
        <button onClick={next} className="w-8 h-8 border border-border flex items-center justify-center text-muted hover:border-accent hover:text-accent transition-all duration-200 font-mono text-xs">→</button>
      </div>
    </section>
  )
}
