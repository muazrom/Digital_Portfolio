import Icon from './Icon'
import { useData } from '../context/DataContext'

const levelColor = {
  1: 'rgba(var(--overlay-rgb), 0.15)',
  2: 'rgba(var(--accent-rgb), 0.45)',
  3: 'var(--accent)',
}

function ToolTag({ name, level, icon }) {
  return (
    <div className="group relative" style={{ cursor: 'default' }}>
      <div style={{
        width: 6, height: 6, borderRadius: '50%', background: 'var(--border-subtle)',
        border: '1px solid var(--border-strong)', margin: '0 auto 6px', transition: 'border-color 0.2s',
      }} className="group-hover:border-accent" />
      <div className="group-hover:-translate-y-1" style={{
        background: 'var(--surface-raised)', border: '1px solid var(--border-strong)', borderRadius: 6,
        padding: '10px 14px', textAlign: 'center',
        transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
        position: 'relative', minWidth: 90,
        boxShadow: '0 2px 8px var(--shadow-1)',
      }}>
        <div style={{ position: 'absolute', top: -7, left: '50%', width: 1, height: 7, background: 'var(--border-strong)', transform: 'translateX(-50%)' }} />
        {icon && (
          <div className="group-hover:text-accent" style={{
            display: 'flex', justifyContent: 'center', marginBottom: 5,
            color: level === 1 ? 'var(--text-faint)' : 'var(--accent-text)',
            transition: 'color 0.25s ease',
          }}>
            <Icon name={icon} size={15} />
          </div>
        )}
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 500, color: 'var(--text-bright)', whiteSpace: 'nowrap', marginBottom: 6 }}>
          {name}
        </p>
        <div style={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
          {[1, 2, 3].map(n => (
            <span key={n} style={{
              width: 5, height: 5, borderRadius: '50%',
              background: n <= level ? levelColor[level] : 'var(--border-subtle)',
              boxShadow: n <= level && level === 3 ? '0 0 4px rgba(var(--accent-rgb), 0.7)' : 'none',
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Skills({ id, num, icon }) {
  const { data } = useData()

  return (
    <section id={id} className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6">
        <p className="section-number mb-2">// {num}</p>
        <div className="flex items-center gap-2.5 mb-2"><Icon name={icon} size={18} style={{ color: 'var(--accent)' }} /><h2 className="section-title">Skills &amp; Tools</h2></div>
        <p className="font-mono text-xs text-muted mb-14">WORKSHOP_INVENTORY // tools available at each station</p>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '40px 32px',
          position: 'relative',
          backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}>
          <div style={{ position: 'absolute', top: 14, right: 20, fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--border-strong)', letterSpacing: '0.1em' }}>
            BOARD_A // WORKSHOP
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {data.skills.map((station) => (
              <div key={station.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--accent)',
                    background: 'rgba(var(--accent-rgb), 0.08)', border: '1px solid rgba(var(--accent-rgb), 0.2)',
                    padding: '2px 7px', borderRadius: 3,
                  }}>{station.id}</span>
                  {station.icon && (
                    <span style={{ color: 'var(--accent)', display: 'flex' }}>
                      <Icon name={station.icon} size={14} />
                    </span>
                  )}
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text)', fontWeight: 500 }}>
                    {station.label}
                  </span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-dim)' }}>— {station.desc}</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', paddingLeft: 12 }}>
                  {station.tools.map(tool => (
                    <ToolTag key={tool.name} name={tool.name} level={tool.level} icon={tool.icon} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 40, paddingTop: 20, borderTop: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 20,
          }}>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-dim)' }}>PROFICIENCY</span>
            {[['Basic', 1], ['Proficient', 2], ['Strong', 3]].map(([label, l]) => (
              <span key={l} style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: levelColor[l] }} />
                {label.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
