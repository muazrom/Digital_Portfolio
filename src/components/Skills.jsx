import { useData } from '../context/DataContext'

const levelColor = {
  1: 'rgba(255,255,255,0.15)',
  2: 'rgba(37,99,235,0.45)',
  3: '#2563eb',
}

function ToolTag({ name, level }) {
  return (
    <div className="group relative" style={{ cursor: 'default' }}>
      <div style={{
        width: 6, height: 6, borderRadius: '50%', background: '#1a1a1a',
        border: '1px solid #333', margin: '0 auto 6px', transition: 'border-color 0.2s',
      }} className="group-hover:border-accent" />
      <div className="group-hover:-translate-y-1" style={{
        background: '#111', border: '1px solid #2a2a2a', borderRadius: 6,
        padding: '10px 14px', textAlign: 'center',
        transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
        position: 'relative', minWidth: 90,
        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      }}>
        <div style={{ position: 'absolute', top: -7, left: '50%', width: 1, height: 7, background: '#333', transform: 'translateX(-50%)' }} />
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 500, color: '#ccc', whiteSpace: 'nowrap', marginBottom: 6 }}>
          {name}
        </p>
        <div style={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
          {[1, 2, 3].map(n => (
            <span key={n} style={{
              width: 5, height: 5, borderRadius: '50%',
              background: n <= level ? levelColor[level] : '#222',
              boxShadow: n <= level && level === 3 ? '0 0 4px rgba(37,99,235,0.7)' : 'none',
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Skills() {
  const { data } = useData()

  return (
    <section id="skills" className="py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.4), transparent)' }} />
      <div className="max-w-5xl mx-auto px-6">
        <p className="section-number mb-2">// 03</p>
        <h2 className="section-title mb-2">Skills &amp; Tools</h2>
        <p className="font-mono text-xs text-muted mb-14">WORKSHOP_INVENTORY // tools available at each station</p>

        <div style={{
          background: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: 12, padding: '40px 32px',
          position: 'relative',
          backgroundImage: 'radial-gradient(circle, #1e1e1e 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}>
          <div style={{ position: 'absolute', top: 14, right: 20, fontFamily: 'JetBrains Mono', fontSize: 9, color: '#333', letterSpacing: '0.1em' }}>
            BOARD_A // WORKSHOP
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {data.skills.map((station) => (
              <div key={station.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono', fontSize: 9, color: '#2563eb',
                    background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)',
                    padding: '2px 7px', borderRadius: 3,
                  }}>{station.id}</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#fff', fontWeight: 500 }}>
                    {station.label}
                  </span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#444' }}>— {station.desc}</span>
                  <div style={{ flex: 1, height: 1, background: '#1e1e1e' }} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', paddingLeft: 12 }}>
                  {station.tools.map(tool => (
                    <ToolTag key={tool.name} name={tool.name} level={tool.level} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 40, paddingTop: 20, borderTop: '1px solid #1a1a1a',
            display: 'flex', alignItems: 'center', gap: 20,
          }}>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#333' }}>PROFICIENCY</span>
            {[['Basic', 1], ['Proficient', 2], ['Strong', 3]].map(([label, l]) => (
              <span key={l} style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#444', display: 'flex', alignItems: 'center', gap: 5 }}>
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
