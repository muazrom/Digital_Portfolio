const stations = [
  {
    id: 'S01',
    label: 'Languages',
    desc: 'Core syntax',
    tools: [
      { name: 'Python', level: 3 },
      { name: 'JavaScript', level: 3 },
      { name: 'HTML', level: 3 },
      { name: 'CSS', level: 3 },
      { name: 'SQL', level: 2 },
      { name: 'Java', level: 2 },
    ],
  },
  {
    id: 'S02',
    label: 'Frameworks & Libraries',
    desc: 'Build stack',
    tools: [
      { name: 'React', level: 3 },
      { name: 'Tailwind CSS', level: 3 },
      { name: 'Node.js', level: 2 },
      { name: 'Express', level: 2 },
      { name: 'Vite', level: 3 },
      { name: 'Electron', level: 1 },
    ],
  },
  {
    id: 'S03',
    label: 'AI & Prompting',
    desc: 'Intelligence layer',
    tools: [
      { name: 'Prompt Engineering', level: 3 },
      { name: 'LangGraph', level: 2 },
      { name: 'API Integration', level: 3 },
      { name: 'ChromaDB', level: 1 },
      { name: 'AI-assisted Dev', level: 3 },
    ],
  },
  {
    id: 'S04',
    label: 'Cybersecurity',
    desc: 'Security bench',
    tools: [
      { name: 'Secure Auth', level: 2 },
      { name: 'Password Encryption', level: 2 },
      { name: 'Network Fundamentals', level: 1 },
    ],
  },
  {
    id: 'S05',
    label: 'Tools & Platforms',
    desc: 'Workshop gear',
    tools: [
      { name: 'Git / GitHub', level: 3 },
      { name: 'Linux', level: 1 },
      { name: 'Figma', level: 2 },
      { name: 'Excel', level: 2 },
      { name: 'Cloudflare', level: 2 },
      { name: 'SQLite', level: 2 },
    ],
  },
]

// level: 1 = basic, 2 = proficient, 3 = strong
const levelLabel = { 1: 'BASIC', 2: 'PROFICIENT', 3: 'STRONG' }
const levelColor = {
  1: 'rgba(255,255,255,0.15)',
  2: 'rgba(37,99,235,0.45)',
  3: '#2563eb',
}

function ToolTag({ name, level }) {
  return (
    <div
      className="group relative"
      style={{
        cursor: 'default',
      }}
    >
      {/* Peg hole */}
      <div style={{
        width: 6, height: 6, borderRadius: '50%',
        background: '#1a1a1a',
        border: '1px solid #333',
        margin: '0 auto 6px',
        transition: 'border-color 0.2s',
      }}
        className="group-hover:border-accent"
      />

      {/* Tag body */}
      <div
        className="group-hover:-translate-y-1 group-hover:border-accent/50"
        style={{
          background: '#111',
          border: '1px solid #2a2a2a',
          borderRadius: 6,
          padding: '10px 14px',
          textAlign: 'center',
          transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
          position: 'relative',
          minWidth: 90,
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}
      >
        {/* String from peg hole */}
        <div style={{
          position: 'absolute',
          top: -7, left: '50%',
          width: 1, height: 7,
          background: '#333',
          transform: 'translateX(-50%)',
        }} />

        <p style={{
          fontFamily: 'JetBrains Mono',
          fontSize: 11,
          fontWeight: 500,
          color: '#ccc',
          whiteSpace: 'nowrap',
          marginBottom: 6,
        }}>
          {name}
        </p>

        {/* Level dots */}
        <div style={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
          {[1, 2, 3].map(n => (
            <span key={n} style={{
              width: 5, height: 5, borderRadius: '50%',
              background: n <= level ? levelColor[level] : '#222',
              boxShadow: n <= level && level === 3 ? '0 0 4px rgba(37,99,235,0.7)' : 'none',
              transition: 'background 0.2s',
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="py-24 relative">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.4), transparent)' }}
      />

      <div className="max-w-5xl mx-auto px-6">
        <p className="section-number mb-2">// 03</p>
        <h2 className="section-title mb-2">Skills &amp; Tools</h2>
        <p className="font-mono text-xs text-muted mb-14">WORKSHOP_INVENTORY // tools available at each station</p>

        {/* Pegboard surface */}
        <div
          style={{
            background: '#0d0d0d',
            border: '1px solid #1e1e1e',
            borderRadius: 12,
            padding: '40px 32px',
            position: 'relative',
            backgroundImage: 'radial-gradient(circle, #1e1e1e 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          {/* Board label */}
          <div style={{
            position: 'absolute',
            top: 14, right: 20,
            fontFamily: 'JetBrains Mono',
            fontSize: 9,
            color: '#333',
            letterSpacing: '0.1em',
          }}>
            BOARD_A // WORKSHOP
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {stations.map((station) => (
              <div key={station.id}>
                {/* Station header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  marginBottom: 24,
                }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: 9,
                    color: '#2563eb',
                    background: 'rgba(37,99,235,0.08)',
                    border: '1px solid rgba(37,99,235,0.2)',
                    padding: '2px 7px',
                    borderRadius: 3,
                  }}>
                    {station.id}
                  </span>
                  <span style={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: 11,
                    color: '#fff',
                    fontWeight: 500,
                  }}>
                    {station.label}
                  </span>
                  <span style={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: 9,
                    color: '#444',
                  }}>
                    — {station.desc}
                  </span>
                  {/* Divider line */}
                  <div style={{ flex: 1, height: 1, background: '#1e1e1e' }} />
                </div>

                {/* Tools row */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px 16px',
                  paddingLeft: 12,
                }}>
                  {station.tools.map(tool => (
                    <ToolTag key={tool.name} name={tool.name} level={tool.level} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{
            marginTop: 40,
            paddingTop: 20,
            borderTop: '1px solid #1a1a1a',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#333' }}>PROFICIENCY</span>
            {[1, 2, 3].map(l => (
              <span key={l} style={{
                fontFamily: 'JetBrains Mono', fontSize: 9,
                color: '#444', display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <span style={{
                  display: 'inline-block',
                  width: 5, height: 5, borderRadius: '50%',
                  background: levelColor[l],
                }} />
                {levelLabel[l]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
