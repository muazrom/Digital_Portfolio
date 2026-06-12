import { useState, useRef } from 'react'
import { useData } from '../context/DataContext'

const SIZE = 340, CENTER = SIZE / 2, RADIUS = 124

export default function Experience() {
  const { data } = useData()
  const experiences = data.experience
  const [active, setActive] = useState(0)
  const touchStartX = useRef(null)
  const total = experiences.length

  const safeActive = Math.min(active, total - 1)
  const ringRotation = -(360 / total) * safeActive

  const prev = () => setActive(i => (i - 1 + total) % total)
  const next = () => setActive(i => (i + 1) % total)

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (diff > 40) next()
    else if (diff < -40) prev()
    touchStartX.current = null
  }

  if (total === 0) return null
  const exp = experiences[safeActive]

  return (
    <section id="experience" className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.4), transparent)' }} />
      <div className="max-w-5xl mx-auto px-6 mb-8">
        <p className="section-number mb-2">// 05</p>
        <div className="flex items-end justify-between">
          <h2 className="section-title">Experience &amp; Activities</h2>
          <div className="flex items-center gap-3">
            <button onClick={prev} className="w-8 h-8 border border-border flex items-center justify-center text-muted hover:border-accent hover:text-accent disabled:opacity-20 transition-all duration-200">←</button>
            <span className="font-mono text-xs text-muted">{String(safeActive + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <button onClick={next} className="w-8 h-8 border border-border flex items-center justify-center text-muted hover:border-accent hover:text-accent disabled:opacity-20 transition-all duration-200">→</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 max-w-5xl mx-auto px-6">
        <div className="relative shrink-0 select-none" style={{ width: SIZE, height: SIZE }}
          onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <svg className="absolute inset-0 pointer-events-none" width={SIZE} height={SIZE} style={{ overflow: 'visible' }}>
            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="#2a2a2a" strokeWidth="1" strokeDasharray="3 7" />
            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="rgba(37,99,235,0.08)" strokeWidth="12" />
            <circle cx={CENTER} cy={CENTER - RADIUS} r={5} fill="#2563eb" style={{ filter: 'drop-shadow(0 0 8px rgba(37,99,235,1))' }} />
          </svg>

          <div className="absolute inset-0" style={{
            transformOrigin: `${CENTER}px ${CENTER}px`,
            transform: `rotate(${ringRotation}deg)`,
            transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            {experiences.map((e, i) => {
              const angleDeg = (360 / total) * i
              const angleRad = (angleDeg - 90) * (Math.PI / 180)
              const nx = CENTER + RADIUS * Math.cos(angleRad)
              const ny = CENTER + RADIUS * Math.sin(angleRad)
              const isActive = i === safeActive

              return (
                <div key={e.id} onClick={() => setActive(i)} style={{
                  position: 'absolute', left: nx, top: ny,
                  transform: `translate(-50%, -50%) rotate(${-ringRotation}deg)`,
                  transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer', zIndex: isActive ? 10 : 1,
                }}>
                  {isActive ? (
                    <div style={{ background: '#111', border: '1px solid rgba(37,99,235,0.55)', borderRadius: 8, padding: '10px 14px', width: 150, textAlign: 'center', boxShadow: '0 0 24px rgba(37,99,235,0.18)', pointerEvents: 'none' }}>
                      <p style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#2563eb', marginBottom: 4 }}>{e.period}</p>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', lineHeight: 1.4, fontFamily: 'Space Grotesk, sans-serif' }}>{e.role}</p>
                      <p style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#666', marginTop: 4, lineHeight: 1.3 }}>{e.org}</p>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', width: 80 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#141414', border: '1px solid #2a2a2a', margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono', fontSize: 9, color: '#444' }}>
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <p style={{ fontFamily: 'JetBrains Mono', fontSize: 8.5, color: '#555', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {e.role}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ position: 'absolute', left: CENTER, top: CENTER, transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#333' }}>
              {String(safeActive + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(total).padStart(2, '0')}
            </p>
          </div>

          <div className="absolute flex items-center gap-4" style={{ bottom: 4, left: '50%', transform: 'translateX(-50%)' }}>
            <button onClick={prev} className="w-7 h-7 border border-border flex items-center justify-center text-muted hover:border-accent hover:text-accent transition-all duration-200 font-mono text-xs">←</button>
            <button onClick={next} className="w-7 h-7 border border-border flex items-center justify-center text-muted hover:border-accent hover:text-accent transition-all duration-200 font-mono text-xs">→</button>
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="card p-6" key={safeActive} style={{ animation: 'fade-up 0.35s ease forwards' }}>
            <p className="font-mono text-xs text-accent mb-1">{exp.period}</p>
            <h3 className="text-white font-semibold text-xl mb-1 font-display">{exp.role}</h3>
            <p className="font-mono text-xs text-muted mb-5">{exp.org}</p>
            <p className="text-muted text-sm leading-relaxed">{exp.summary}</p>
          </div>
          <div className="flex items-center gap-2 mt-5">
            {experiences.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} style={{ height: 5, width: safeActive === i ? 20 : 5, borderRadius: safeActive === i ? 3 : '50%', background: safeActive === i ? '#2563eb' : '#2a2a2a', transition: 'all 0.25s ease' }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
