import Icon from './Icon'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { useWindowSize } from '../hooks/useWindowSize'

const statusColor = {
  Live: 'var(--ok)', 'In Development': 'var(--warn)', Ongoing: 'var(--accent-bright)', Completed: 'var(--text-muted)',
}

const csLabel = { fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.12em', color: 'var(--accent)', textTransform: 'uppercase' }
const csSubLabel = { fontFamily: 'JetBrains Mono', fontSize: 9.5, letterSpacing: '0.08em', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 6 }
const csList = { margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }
const csListItem = { fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.55, paddingLeft: 14, position: 'relative' }
const csBullet = { position: 'absolute', left: 0, color: 'var(--accent)' }

// Case study body — accepts either the legacy plain-string format or the structured
// { problem, idea, scope, constraints, workflow, concepts, finished } object. `twoColumn`
// splits scope/constraints/workflow (left) from idea/concepts (right) on desktop; mobile
// always stacks single-column since there isn't room for two.
function CaseStudyContent({ caseStudy, twoColumn }) {
  if (!caseStudy) return <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>Case study coming soon.</p>
  if (typeof caseStudy === 'string') return <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{caseStudy}</p>

  const { problem, idea, scope, constraints, workflow, concepts, finished } = caseStudy

  const left = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {(scope || constraints) && (
        <div>
          <p style={csLabel}>Scope &amp; Constraints</p>
          <div style={{ display: 'flex', gap: 20, marginTop: 10, flexWrap: 'wrap' }}>
            {scope && (
              <div style={{ flex: '1 1 160px' }}>
                <p style={csSubLabel}>In scope</p>
                <ul style={csList}>
                  {scope.map((s, i) => <li key={i} style={csListItem}><span style={csBullet}>▹</span>{s}</li>)}
                </ul>
              </div>
            )}
            {constraints && (
              <div style={{ flex: '1 1 160px' }}>
                <p style={csSubLabel}>Constraints</p>
                <ul style={csList}>
                  {constraints.map((c, i) => <li key={i} style={csListItem}><span style={{ ...csBullet, color: 'var(--text-dim)' }}>▹</span>{c}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      {workflow && (
        <div>
          <p style={csLabel}>Workflow</p>
          <div style={{ marginTop: 10 }}>
            {workflow.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <span style={{
                    width: 16, height: 16, borderRadius: '50%', border: '1px solid rgba(var(--accent-rgb), 0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'JetBrains Mono', fontSize: 8.5, color: 'var(--accent)', flexShrink: 0,
                  }}>{i + 1}</span>
                  {i < workflow.length - 1 && <span style={{ width: 1, flex: 1, background: 'var(--border-subtle)', marginTop: 2, marginBottom: 2 }} />}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.55, paddingBottom: 14 }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const right = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {idea && (
        <div>
          <p style={csLabel}>The Idea</p>
          <p style={{ fontSize: 12.5, color: 'var(--text-body)', lineHeight: 1.75, marginTop: 10 }}>{idea}</p>
        </div>
      )}
      {concepts && (
        <div>
          <p style={csLabel}>Concepts</p>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {concepts.map((c, i) => (
              <div key={i}>
                <p style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--accent-text)', marginBottom: 4 }}>{c.name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.65 }}>{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {finished && (
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: 10.5, color: 'var(--text-dim)' }}>
          <span style={{ color: 'var(--ok)' }}>●</span>&nbsp; {finished}
        </p>
      )}
      {problem && (
        <blockquote style={{
          margin: 0, borderLeft: '2px solid var(--accent)', paddingLeft: 16,
          fontFamily: 'Space Grotesk, sans-serif', fontSize: 14.5, fontStyle: 'italic',
          color: 'var(--text-strong)', lineHeight: 1.55,
        }}>
          {problem}
        </blockquote>
      )}
      <div style={twoColumn ? { display: 'flex', gap: 40 } : { display: 'flex', flexDirection: 'column', gap: 26 }}>
        <div style={{ flex: 1, minWidth: 0 }}>{left}</div>
        <div style={{ flex: 1, minWidth: 0 }}>{right}</div>
      </div>
    </div>
  )
}

function getCardStyle(rel, offset, farOffset) {
  const abs = Math.abs(rel)
  const sign = rel >= 0 ? 1 : -1
  // Center + immediate neighbors are "clear" (full opacity); the next ring out fades in dimmed.
  if (abs === 0) return { transform: 'translateX(0px) rotateY(0deg) scale(1)', opacity: 1, zIndex: 10, pointerEvents: 'auto' }
  if (abs === 1) return { transform: `translateX(${sign * offset}px) rotateY(${sign * -20}deg) scale(0.88)`, opacity: 1, zIndex: 6, pointerEvents: 'auto' }
  if (abs === 2) return { transform: `translateX(${sign * farOffset}px) rotateY(${sign * -42}deg) scale(0.65)`, opacity: 0.35, zIndex: 2, pointerEvents: 'auto' }
  return { transform: `translateX(${sign * farOffset * 1.3}px) rotateY(${sign * -55}deg) scale(0.5)`, opacity: 0, zIndex: 1, pointerEvents: 'none' }
}

export default function Projects({ id, num, icon }) {
  const { data } = useData()
  const projects = data.projects
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [modalProj, setModalProj] = useState(null)
  const { w, h } = useWindowSize()
  const total = projects.length
  const safeIndex = Math.min(index, total - 1)

  // Escape closes the case-study modal, matching the credentials detail panel
  // and the mobile nav — same pattern as Navbar.jsx.
  useEffect(() => {
    if (!modalProj) return
    const onEsc = (e) => { if (e.key === 'Escape') setModalProj(null) }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [modalProj])

  // Fluid card sizing — 58vw on mobile, capped at 280px on desktop
  const CARD_W = Math.min(Math.floor(w * 0.58), 280)
  const CARD_H = Math.round(CARD_W * 1.36)
  // Side card offset scales with card width — wide enough that neighbors clear the center card
  const SIDE_OFFSET = Math.round(CARD_W * 0.95)
  const FAR_OFFSET = Math.round(CARD_W * 1.35)
  // Expanded (flipped) card grows to fill the section's content column (matches max-w-5xl minus its px-6 padding)
  const LANDSCAPE_W = Math.min(Math.round(w * 0.9), 976)
  // Tall enough that the card, centred on the carousel's original midpoint, grows up past its own
  // top edge and covers the section header ("// 04" + title) sitting above it.
  const LANDSCAPE_H = Math.min(700, Math.round(h * 0.85))

  const prev = () => { setOpen(false); setIndex(i => (i - 1 + total) % total) }
  const next = () => { setOpen(false); setIndex(i => (i + 1) % total) }

  const wheelAccum = useRef(0)
  const onWheel = useCallback((e) => {
    if (open) return
    e.preventDefault()
    wheelAccum.current += e.deltaY
    if (wheelAccum.current > 60) { next(); wheelAccum.current = 0 }
    else if (wheelAccum.current < -60) { prev(); wheelAccum.current = 0 }
  }, [total, open])

  const touchX = useRef(null)
  const onTouchStart = (e) => { if (!open) touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current === null) return
    const diff = touchX.current - e.changedTouches[0].clientX
    if (diff > 40) next()
    else if (diff < -40) prev()
    touchX.current = null
  }

  if (total === 0) return null

  // Carousel is hard to scan on small screens — show a plain grid instead.
  const isMobile = w < 768

  if (isMobile) {
    return (
      <section id={id} className="py-24 relative">
        <div className="max-w-5xl mx-auto px-6 mb-10">
          <p className="section-number mb-2">// {num}</p>
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-2.5"><Icon name={icon} size={18} style={{ color: 'var(--accent)' }} /><h2 className="section-title">Projects</h2></div>
            <span className="font-mono text-xs text-muted">{String(total).padStart(2, '0')} total</span>
          </div>
          <p className="font-mono text-xs text-muted mt-3">
            BUILD_LOG // security-relevant work, plus the tooling I build to automate things
          </p>
        </div>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div key={proj.id} style={{
              background: 'linear-gradient(160deg, var(--surface) 0%, var(--surface) 100%)',
              border: '1px solid var(--surface-raised)', borderRadius: 12, padding: 18,
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor[proj.status], boxShadow: `0 0 6px ${statusColor[proj.status]}`, flexShrink: 0 }} />
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: statusColor[proj.status] }}>{proj.status}</span>
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 6, fontFamily: 'Space Grotesk, sans-serif' }}>{proj.name}</h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>{proj.description}</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {proj.stack.map(tech => (
                  <span key={tech} style={{ fontFamily: 'JetBrains Mono', fontSize: 9, background: 'rgba(var(--accent-rgb), 0.07)', border: '1px solid rgba(var(--accent-rgb), 0.15)', color: 'var(--text-dim)', padding: '2px 6px', borderRadius: 3 }}>{tech}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', paddingTop: 10, marginTop: 'auto', borderTop: '1px solid var(--border-subtle)' }}>
                <button onClick={() => setModalProj(proj)} style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  ⤢ Case study
                </button>
                {proj.image && <a href={proj.image} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-muted)' }}>Screenshot ↗</a>}
                {proj.live && <a href={proj.live} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-muted)' }}>Live demo ↗</a>}
              </div>
            </div>
          ))}
        </div>

        {modalProj && (
          <div onClick={() => setModalProj(null)} style={{
            position: 'fixed', inset: 0, background: 'var(--scrim)', backdropFilter: 'blur(4px)',
            zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          }}>
            <div onClick={e => e.stopPropagation()} style={{
              width: '100%', maxWidth: 480, maxHeight: '85vh', overflowY: 'auto',
              background: 'var(--surface)', border: '1px solid rgba(var(--accent-rgb), 0.5)', borderRadius: 14,
              padding: 20, display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{modalProj.name}</h3>
                <button onClick={() => setModalProj(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>✕</button>
              </div>
              <CaseStudyContent caseStudy={modalProj.caseStudy} />
              <div style={{ display: 'flex', gap: 16, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                {modalProj.image && <a href={modalProj.image} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-muted)' }}>Screenshot ↗</a>}
                {modalProj.github && <a href={modalProj.github} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-muted)' }}>GitHub ↗</a>}
                {modalProj.live && <a href={modalProj.live} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--accent)' }}>Live demo ↗</a>}
              </div>
            </div>
          </div>
        )}
      </section>
    )
  }

  const flipEase = 'cubic-bezier(0.4, 0, 0.2, 1)'

  return (
    <section id={id} className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6 mb-14">
        <p className="section-number mb-2">// {num}</p>
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-2.5"><Icon name={icon} size={18} style={{ color: 'var(--accent)' }} /><h2 className="section-title">Projects</h2></div>
          <span className="font-mono text-xs text-muted">
            {String(safeIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(total).padStart(2, '0')}
          </span>
        </div>
        <p className="font-mono text-xs text-muted mt-3">
          BUILD_LOG // security-relevant work, plus the tooling I build to automate things
        </p>
      </div>

      <div className="relative mx-auto" style={{ width: CARD_W, height: CARD_H, perspective: 1200, perspectiveOrigin: '50% 40%' }}
        onWheel={onWheel} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {projects.map((proj, i) => {
          let rel = i - safeIndex
          if (rel > total / 2) rel -= total
          if (rel < -total / 2) rel += total
          const isActive = rel === 0
          const isExpanded = isActive && open
          const baseStyle = getCardStyle(rel, SIDE_OFFSET, FAR_OFFSET)
          const style = (open && !isActive) ? { ...baseStyle, opacity: 0, pointerEvents: 'none' } : baseStyle

          return (
            <div key={proj.id} onClick={() => { if (!isActive) { setOpen(false); setIndex(i) } }} style={{
              position: 'absolute', width: CARD_W, height: CARD_H,
              transformStyle: 'preserve-3d', transformOrigin: 'center center',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease',
              cursor: isActive ? 'default' : 'pointer', ...style,
            }}>
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                width: isExpanded ? LANDSCAPE_W : CARD_W,
                height: isExpanded ? LANDSCAPE_H : CARD_H,
                transformStyle: 'preserve-3d',
                transform: `translate(-50%, -50%) rotateY(${isExpanded ? 180 : 0}deg)`,
                transition: isExpanded
                  ? `transform 0.4s ${flipEase} 0s, width 0.4s ${flipEase} 0.4s, height 0.4s ${flipEase} 0.4s`
                  : `width 0.4s ${flipEase} 0s, height 0.4s ${flipEase} 0s, transform 0.4s ${flipEase} 0.4s`,
              }}>
                {/* FRONT */}
                <div style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                  background: isActive ? 'linear-gradient(160deg, var(--surface) 0%, var(--surface) 100%)' : 'var(--surface-sunken)',
                  border: `1px solid ${isActive ? 'rgba(var(--accent-rgb), 0.5)' : 'var(--surface-raised)'}`,
                  borderRadius: 12, padding: Math.round(CARD_W * 0.08),
                  display: 'flex', flexDirection: 'column', gap: Math.round(CARD_W * 0.04),
                  boxShadow: isActive ? '0 0 40px rgba(var(--accent-rgb), 0.15), 0 24px 64px var(--shadow-3)' : '0 8px 24px var(--shadow-2)',
                  overflow: 'hidden',
                }}>
                  {isActive && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor[proj.status], boxShadow: `0 0 6px ${statusColor[proj.status]}`, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: statusColor[proj.status] }}>{proj.status}</span>
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <h3 style={{ fontSize: Math.round(CARD_W * 0.078), fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 8, fontFamily: 'Space Grotesk, sans-serif' }}>{proj.name}</h3>
                    <p style={{ fontSize: Math.round(CARD_W * 0.044), color: 'var(--text-muted)', lineHeight: 1.6 }}>{proj.description}</p>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {proj.stack.map(tech => (
                      <span key={tech} style={{ fontFamily: 'JetBrains Mono', fontSize: 9, background: 'rgba(var(--accent-rgb), 0.07)', border: '1px solid rgba(var(--accent-rgb), 0.15)', color: 'var(--text-dim)', padding: '2px 6px', borderRadius: 3 }}>{tech}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 16, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                    <button onClick={e => { e.stopPropagation(); if (!isActive) setIndex(i); setOpen(true) }} style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-bright)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--accent)'}>⤢ Case study</button>
                    {proj.image && <a href={proj.image} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-faint)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-faint)'}>Screenshot ↗</a>}
                    {proj.live && <a href={proj.live} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-faint)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-faint)'}>Live demo ↗</a>}
                  </div>
                </div>

                {/* BACK — case study, only reachable via the active card */}
                <div style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  background: 'var(--surface)', border: '1px solid rgba(var(--accent-rgb), 0.5)', borderRadius: 12,
                  display: 'flex', justifyContent: 'center', overflow: 'hidden',
                  boxShadow: '0 0 40px rgba(var(--accent-rgb), 0.15), 0 24px 64px var(--shadow-3)',
                }}>
                  <div style={{ width: '100%', maxWidth: typeof proj.caseStudy === 'object' ? 'none' : 640, display: 'flex', flexDirection: 'column', padding: '36px 40px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>Case Study</h4>
                      <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0 }}>✕</button>
                    </div>
                    <div style={{ flex: 1 }}>
                      <CaseStudyContent caseStudy={proj.caseStudy} twoColumn />
                    </div>
                    <div style={{ display: 'flex', gap: 16, paddingTop: 16, marginTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
                      {proj.image && <a href={proj.image} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-faint)' }}>Screenshot ↗</a>}
                      {proj.github && <a href={proj.github} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-faint)' }}>GitHub ↗</a>}
                      {proj.live && <a href={proj.live} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--accent)' }}>Live demo ↗</a>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-center gap-6 mt-16" style={{ opacity: open ? 0 : 1, pointerEvents: open ? 'none' : 'auto', transition: 'opacity 0.3s ease' }}>
        <button onClick={prev} className="w-8 h-8 border border-border flex items-center justify-center text-muted hover:border-accent hover:text-accent transition-all duration-200 font-mono text-xs">←</button>
        <div className="flex items-center gap-2">
          {projects.map((_, i) => (
            <button key={i} onClick={() => { setOpen(false); setIndex(i) }} style={{ height: 5, width: safeIndex === i ? 20 : 5, borderRadius: safeIndex === i ? 3 : '50%', background: safeIndex === i ? 'var(--accent)' : 'var(--border)', transition: 'all 0.25s ease' }} />
          ))}
        </div>
        <button onClick={next} className="w-8 h-8 border border-border flex items-center justify-center text-muted hover:border-accent hover:text-accent transition-all duration-200 font-mono text-xs">→</button>
      </div>
    </section>
  )
}
