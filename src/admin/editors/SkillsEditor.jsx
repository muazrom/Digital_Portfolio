import { useState } from 'react'
import { useData } from '../../context/DataContext'

const levelLabel = { 1: 'Basic', 2: 'Proficient', 3: 'Strong' }
const levelColor = { 1: 'var(--text-faint)', 2: 'rgba(var(--accent-rgb), 0.7)', 3: 'var(--accent)' }

export default function SkillsEditor() {
  const { data, addStation, updateStation, removeStation, addTool, removeTool, updateToolLevel } = useData()
  const [newToolName, setNewToolName] = useState({})
  const [newStationLabel, setNewStationLabel] = useState('')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {data.skills.map((station) => (
        <div key={station.id} style={{
          background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)',
          borderRadius: 8, padding: 20,
        }}>
          {/* Station header */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
            <span style={{
              fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--accent)',
              background: 'rgba(var(--accent-rgb), 0.08)', border: '1px solid rgba(var(--accent-rgb), 0.2)',
              padding: '2px 7px', borderRadius: 3,
            }}>{station.id}</span>
            <input
              value={station.label}
              onChange={e => updateStation(station.id, 'label', e.target.value)}
              style={{
                background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)',
                color: 'var(--text)', fontSize: 14, fontWeight: 600, outline: 'none', flex: 1,
                padding: '2px 4px',
              }}
            />
            <input
              value={station.desc}
              onChange={e => updateStation(station.id, 'desc', e.target.value)}
              placeholder="description"
              style={{
                background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)',
                color: 'var(--text-faint)', fontSize: 11, fontFamily: 'JetBrains Mono', outline: 'none',
                width: 140, padding: '2px 4px',
              }}
            />
            <button onClick={() => removeStation(station.id)} style={{
              background: 'none', border: '1px solid var(--border)', color: 'var(--text-faint)',
              borderRadius: 4, padding: '3px 10px', cursor: 'pointer', fontSize: 11,
              fontFamily: 'JetBrains Mono',
            }}>remove</button>
          </div>

          {/* Tools */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {station.tools.map(tool => (
              <div key={tool.name} style={{
                background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6,
                padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-bright)' }}>
                  {tool.name}
                </span>
                {/* Level selector */}
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1, 2, 3].map(l => (
                    <button key={l} onClick={() => updateToolLevel(station.id, tool.name, l)}
                      title={levelLabel[l]}
                      style={{
                        width: 10, height: 10, borderRadius: '50%', border: 'none', cursor: 'pointer',
                        background: l <= tool.level ? levelColor[tool.level] : 'var(--border-subtle)',
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
                <button onClick={() => removeTool(station.id, tool.name)} style={{
                  background: 'none', border: 'none', color: 'var(--border-strong)', cursor: 'pointer',
                  fontSize: 14, lineHeight: 1, padding: 0,
                }}>×</button>
              </div>
            ))}
          </div>

          {/* Add tool */}
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={newToolName[station.id] || ''}
              onChange={e => setNewToolName(p => ({ ...p, [station.id]: e.target.value }))}
              onKeyDown={e => {
                if (e.key === 'Enter' && newToolName[station.id]?.trim()) {
                  addTool(station.id, newToolName[station.id].trim())
                  setNewToolName(p => ({ ...p, [station.id]: '' }))
                }
              }}
              placeholder="Add tool… (Enter)"
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4,
                padding: '7px 12px', color: 'var(--text)', fontSize: 12,
                fontFamily: 'JetBrains Mono', outline: 'none', flex: 1,
              }}
            />
            <button
              onClick={() => {
                if (newToolName[station.id]?.trim()) {
                  addTool(station.id, newToolName[station.id].trim())
                  setNewToolName(p => ({ ...p, [station.id]: '' }))
                }
              }}
              style={{
                background: 'rgba(var(--accent-rgb), 0.15)', border: '1px solid rgba(var(--accent-rgb), 0.3)',
                color: 'var(--accent)', borderRadius: 4, padding: '7px 14px',
                cursor: 'pointer', fontSize: 12, fontFamily: 'JetBrains Mono',
              }}
            >+ Add</button>
          </div>
        </div>
      ))}

      {/* Add station */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={newStationLabel}
          onChange={e => setNewStationLabel(e.target.value)}
          placeholder="New station name…"
          style={{
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4,
            padding: '9px 14px', color: 'var(--text)', fontSize: 13,
            fontFamily: 'JetBrains Mono', outline: 'none', flex: 1,
          }}
        />
        <button
          onClick={() => {
            if (newStationLabel.trim()) {
              addStation()
              setNewStationLabel('')
            }
          }}
          style={{
            background: 'var(--accent)', color: 'var(--text)', border: 'none', borderRadius: 4,
            padding: '9px 18px', cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: 12,
          }}
        >+ Station</button>
      </div>
    </div>
  )
}
