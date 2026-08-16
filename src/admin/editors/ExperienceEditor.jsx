import { useState } from 'react'
import { useData } from '../../context/DataContext'

const blank = { role: '', org: '', period: '', summary: '' }

function ExpCard({ exp, onUpdate, onRemove }) {
  return (
    <div style={{ background: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: 8, padding: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        {[['ROLE', 'role'], ['PERIOD', 'period']].map(([label, key]) => (
          <div key={key}>
            <label style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#555', display: 'block', marginBottom: 5 }}>{label}</label>
            <input value={exp[key]} onChange={e => onUpdate(key, e.target.value)}
              style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 4, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none' }} />
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#555', display: 'block', marginBottom: 5 }}>ORGANISATION</label>
        <input value={exp.org} onChange={e => onUpdate('org', e.target.value)}
          style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 4, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none' }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#555', display: 'block', marginBottom: 5 }}>SUMMARY</label>
        <textarea rows={3} value={exp.summary} onChange={e => onUpdate('summary', e.target.value)}
          style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 4, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none', resize: 'vertical' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onRemove} style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          color: '#ef4444', borderRadius: 4, padding: '6px 14px',
          cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: 11,
        }}>Remove</button>
      </div>
    </div>
  )
}

export default function ExperienceEditor() {
  const { data, addExperience, updateExperience, removeExperience } = useData()
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState(blank)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {data.experience.map(exp => (
        <ExpCard
          key={exp.id}
          exp={exp}
          onUpdate={(field, val) => updateExperience(exp.id, field, val)}
          onRemove={() => removeExperience(exp.id)}
        />
      ))}

      {adding ? (
        <div style={{ background: '#0d0d0d', border: '1px dashed #2563eb', borderRadius: 8, padding: 20 }}>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#2563eb', marginBottom: 16 }}>NEW ENTRY</p>
          <ExpCard
            exp={draft}
            onUpdate={(field, val) => setDraft(d => ({ ...d, [field]: val }))}
            onRemove={() => { setAdding(false); setDraft(blank) }}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button onClick={() => { addExperience(draft); setAdding(false); setDraft(blank) }}
              style={{
                background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4,
                padding: '9px 20px', cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: 12,
              }}>Save Entry</button>
            <button onClick={() => { setAdding(false); setDraft(blank) }}
              style={{
                background: 'none', border: '1px solid #2a2a2a', color: '#555', borderRadius: 4,
                padding: '9px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: 12,
              }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={{
          background: 'rgba(37,99,235,0.06)', border: '1px dashed rgba(37,99,235,0.3)',
          borderRadius: 8, padding: '16px', color: '#2563eb',
          cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: 12,
          width: '100%',
        }}>+ Add Entry</button>
      )}
    </div>
  )
}
