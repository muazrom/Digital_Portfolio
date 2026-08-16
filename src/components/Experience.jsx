import Icon from './Icon'
import { useState, useRef } from 'react'
import { useData } from '../context/DataContext'
import { useWindowSize } from '../hooks/useWindowSize'

export default function Experience({ id, num, icon }) {
  const { data } = useData()
  const experiences = data.experience
  // Split by track so one technical internship isn't buried among six event roles.
  // The ring carries technical work only — that is the spotlight, and it is what
  // someone hiring for infrastructure came to read. Leadership sits below.
  const technical = experiences.filter(e => e.track === 'technical')
  const leadership = experiences.filter(e => e.track === 'leadership')
  const ringItems = technical.length > 0 ? technical : experiences
  const [active, setActive] = useState(0)
  const touchStartX = useRef(null)
  const total = ringItems.length

  const { w } = useWindowSize()
  const isMobile = w < 768
  // Ring scales fluidly: full size 340px on desktop, shrinks to ~85vw on mobile, min 240px
  const SIZE = Math.min(Math.max(Math.floor(w * 0.85), 240), 340)
  const CENTER = SIZE / 2
  const RADIUS = Math.round(SIZE * 0.365)

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
  const exp = ringItems[safeActive]

  // Divider heading shared by both breakpoints, same treatment as the section
  // sub-headings elsewhere on the site.
  const GroupLabel = ({ title, note, icon: glyph }) => (
    <div className="flex items-center gap-2.5 mb-4">
      <span style={{ color: 'var(--accent)', display: 'flex' }}><Icon name={glyph} size={14} /></span>
      <span className="font-mono text-[11px] text-strong">{title}</span>
      <span className="font-mono text-[9px] text-muted">— {note}</span>
      <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
    </div>
  )

  // Compact row for leadership roles — present and readable, but visibly supporting
  // rather than competing with the technical work above.
  const LeadershipRow = ({ e }) => (
    <div style={{
      background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 8,
      padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 3,
    }}>
      <div className="flex items-baseline justify-between gap-3">
        <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13.5, fontWeight: 600, color: 'var(--text-strong)' }}>{e.role}</h4>
        <span className="font-mono text-[9px]" style={{ color: 'var(--text-dim)', flexShrink: 0 }}>{e.period}</span>
      </div>
      <p className="font-mono text-[9.5px]" style={{ color: 'var(--text-dim)' }}>{e.org}</p>
      <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--text-muted)', marginTop: 2 }}>{e.summary}</p>
    </div>
  )

  // A single role card used by the mobile technical list.
  const RoleCard = ({ e, i }) => (
    <div className="card p-5" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-accent">{e.period}</p>
        <span className="font-mono text-[10px] text-muted">{String(i + 1).padStart(2, '0')}</span>
      </div>
      <h3 className="text-strong font-semibold text-base font-display">{e.role}</h3>
      <p className="font-mono text-xs mb-1" style={{ color: 'var(--text-body)' }}>{e.org}</p>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-bright)' }}>{e.summary}</p>
    </div>
  )

  // Mobile: the rotating ring is fiddly on touch — show all roles as a scannable list.
  if (isMobile) {
    return (
      <section id={id} className="py-24 relative">
        <div className="max-w-5xl mx-auto px-6 mb-8">
          <p className="section-number mb-2">// {num}</p>
          <div className="flex items-center gap-2.5"><Icon name={icon} size={18} style={{ color: 'var(--accent)' }} /><h2 className="section-title">Experience &amp; Activities</h2></div>
        </div>
        <div className="max-w-5xl mx-auto px-6">
          <GroupLabel title="Technical" icon="chip" note={`${technical.length} roles`} />
          <div className="flex flex-col gap-4 mb-10">
            {technical.map((e, i) => <RoleCard key={e.id} e={e} i={i} />)}
          </div>
          {leadership.length > 0 && (
            <>
              <GroupLabel title="Leadership & activities" icon="users" note={`${leadership.length} roles`} />
              <div className="flex flex-col gap-3">
                {leadership.map(e => <LeadershipRow key={e.id} e={e} />)}
              </div>
            </>
          )}
        </div>
      </section>
    )
  }

  return (
    <section id={id} className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6 mb-8">
        <p className="section-number mb-2">// {num}</p>
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-2.5"><Icon name={icon} size={18} style={{ color: 'var(--accent)' }} /><h2 className="section-title">Experience &amp; Activities</h2></div>
          <span className="font-mono text-xs text-muted">{String(safeActive + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 mb-8">
        <GroupLabel title="Technical" icon="chip" note={`${technical.length} roles`} />
      </div>

      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 max-w-5xl mx-auto px-6">
        <div className="relative shrink-0 select-none" style={{ width: SIZE, height: SIZE }}
          onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <svg className="absolute inset-0 pointer-events-none" width={SIZE} height={SIZE} style={{ overflow: 'visible' }}>
            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" style={{ stroke: 'var(--border)' }} strokeWidth="1" strokeDasharray="3 7" />
            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" style={{ stroke: 'rgba(var(--accent-rgb), 0.08)' }} strokeWidth="12" />
            <circle cx={CENTER} cy={CENTER - RADIUS} r={5} style={{ fill: 'var(--accent)', filter: 'drop-shadow(0 0 8px rgba(var(--accent-rgb), 1))' }} />
          </svg>

          <div className="absolute inset-0" style={{
            transformOrigin: `${CENTER}px ${CENTER}px`,
            transform: `rotate(${ringRotation}deg)`,
            transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            {ringItems.map((e, i) => {
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
                    <div style={{ background: 'var(--surface)', border: '1px solid rgba(var(--accent-rgb), 0.55)', borderRadius: 8, padding: '10px 14px', width: 150, textAlign: 'center', boxShadow: '0 0 24px rgba(var(--accent-rgb), 0.18)', pointerEvents: 'none' }}>
                      <p style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--accent)', marginBottom: 4 }}>{e.period}</p>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, fontFamily: 'Space Grotesk, sans-serif' }}>{e.role}</p>
                      <p style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-body)', marginTop: 4, lineHeight: 1.3 }}>{e.org}</p>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', width: 80 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--border-subtle)', border: '1px solid var(--border-strong)', margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-body)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <p style={{ fontFamily: 'JetBrains Mono', fontSize: 8.5, color: 'var(--text-body)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {e.role}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ position: 'absolute', left: CENTER, top: CENTER, transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-muted)' }}>
              {String(safeActive + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(total).padStart(2, '0')}
            </p>
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="card p-6" key={safeActive} style={{ animation: 'fade-up 0.35s ease forwards' }}>
            <p className="font-mono text-xs text-accent mb-1">{exp.period}</p>
            <h3 className="text-strong font-semibold text-xl mb-1 font-display">{exp.role}</h3>
            <p className="font-mono text-xs mb-5" style={{ color: 'var(--text-body)' }}>{exp.org}</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-bright)' }}>{exp.summary}</p>
          </div>
          <div className="flex items-center gap-2 mt-5">
            {ringItems.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} style={{ height: 5, width: safeActive === i ? 20 : 5, borderRadius: safeActive === i ? 3 : '50%', background: safeActive === i ? 'var(--accent)' : 'var(--border)', transition: 'all 0.25s ease' }} />
            ))}
          </div>
        </div>
      </div>

      {leadership.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 mt-14">
          <GroupLabel title="Leadership & activities" icon="users" note={`${leadership.length} roles`} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {leadership.map(e => <LeadershipRow key={e.id} e={e} />)}
          </div>
        </div>
      )}
    </section>
  )
}
