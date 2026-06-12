import { useState } from 'react'
import { useData } from '../../context/DataContext'

const CATEGORIES = ['Award', 'Certificate', 'Course', 'Competition']
const blank = { name: '', issuer: '', date: '', category: 'Certificate', credential: '' }

function BadgeRow({ badge, onUpdate, onRemove }) {
  return (
    <div style={{ background: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: 8, padding: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#555', display: 'block', marginBottom: 5 }}>NAME</label>
          <input value={badge.name} onChange={e => onUpdate('name', e.target.value)}
            style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 4, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none' }} />
        </div>
        <div>
          <label style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#555', display: 'block', marginBottom: 5 }}>CATEGORY</label>
          <select value={badge.category} onChange={e => onUpdate('category', e.target.value)}
            style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 4, padding: '8px 12px', color: '#aaa', fontSize: 12, fontFamily: 'JetBrains Mono', outline: 'none' }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#555', display: 'block', marginBottom: 5 }}>ISSUER</label>
          <input value={badge.issuer} onChange={e => onUpdate('issuer', e.target.value)}
            style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 4, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none' }} />
        </div>
        <div>
          <label style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#555', display: 'block', marginBottom: 5 }}>DATE</label>
          <input value={badge.date} onChange={e => onUpdate('date', e.target.value)}
            placeholder="e.g. 2024"
            style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 4, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none' }} />
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#555', display: 'block', marginBottom: 5 }}>CREDENTIAL URL <span style={{ color: '#333' }}>(optional)</span></label>
        <input value={badge.credential || ''} onChange={e => onUpdate('credential', e.target.value || null)}
          placeholder="https://..."
          style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 4, padding: '8px 12px', color: '#fff', fontSize: 12, fontFamily: 'JetBrains Mono', outline: 'none' }} />
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

export default function BadgesEditor() {
  const { data, addBadge, updateBadge, removeBadge } = useData()
  const badges = data.badges || []
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState(blank)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {badges.map(b => (
        <BadgeRow key={b.id} badge={b}
          onUpdate={(field, val) => updateBadge(b.id, field, val)}
          onRemove={() => removeBadge(b.id)} />
      ))}

      {adding ? (
        <div style={{ background: '#0d0d0d', border: '1px dashed #2563eb', borderRadius: 8, padding: 20 }}>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#2563eb', marginBottom: 16 }}>NEW BADGE</p>
          <BadgeRow badge={draft}
            onUpdate={(field, val) => setDraft(d => ({ ...d, [field]: val }))}
            onRemove={() => { setAdding(false); setDraft(blank) }} />
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button onClick={() => { addBadge(draft); setAdding(false); setDraft(blank) }}
              style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, padding: '9px 20px', cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: 12 }}>
              Save Badge
            </button>
            <button onClick={() => { setAdding(false); setDraft(blank) }}
              style={{ background: 'none', border: '1px solid #2a2a2a', color: '#555', borderRadius: 4, padding: '9px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: 12 }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={{
          background: 'rgba(37,99,235,0.06)', border: '1px dashed rgba(37,99,235,0.3)',
          borderRadius: 8, padding: 16, color: '#2563eb',
          cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: 12, width: '100%',
        }}>+ Add Badge / Certificate</button>
      )}
    </div>
  )
}
