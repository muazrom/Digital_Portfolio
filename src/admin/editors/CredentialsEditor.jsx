import { useState } from 'react'
import { useData } from '../../context/DataContext'

const KINDS = [
  { value: 'certification', label: 'Certification (exam-based)' },
  { value: 'path', label: 'Learning path' },
  { value: 'course', label: 'Course' },
  { value: 'module', label: 'Module' },
]
const TOPICS = ['network', 'security', 'systems']

const blank = {
  name: '', issuer: '', kind: 'course', topic: 'security',
  date: '', image: null, credential: null,
}

const inputStyle = {
  width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 4,
  padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none',
}
const monoInput = { ...inputStyle, fontSize: 12, fontFamily: 'JetBrains Mono' }
const selectStyle = { ...inputStyle, color: '#aaa', fontSize: 12, fontFamily: 'JetBrains Mono' }
const labelStyle = {
  fontFamily: 'JetBrains Mono', fontSize: 10, color: '#555', display: 'block', marginBottom: 5,
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label style={labelStyle}>
        {label}{hint && <span style={{ color: '#333' }}> ({hint})</span>}
      </label>
      {children}
    </div>
  )
}

function CredentialRow({ item, onUpdate, onRemove }) {
  return (
    <div style={{ background: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: 8, padding: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Field label="NAME">
          <input value={item.name} onChange={e => onUpdate('name', e.target.value)} style={inputStyle} />
        </Field>
        <Field label="ISSUER">
          <input value={item.issuer} onChange={e => onUpdate('issuer', e.target.value)} style={inputStyle} />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Field label="KIND">
          <select value={item.kind} onChange={e => onUpdate('kind', e.target.value)} style={selectStyle}>
            {KINDS.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
          </select>
        </Field>
        <Field label="TOPIC">
          <select value={item.topic} onChange={e => onUpdate('topic', e.target.value)} style={selectStyle}>
            {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="DATE" hint="YYYY-MM or YYYY">
          <input value={item.date} onChange={e => onUpdate('date', e.target.value)}
            placeholder="2026-06" style={inputStyle} />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        {/* The badge image ships from content/credentials/, where Vite hashes
            it into the build. Overriding it here only makes sense for a remote
            URL — a bare filename won't resolve. */}
        <Field label="IMAGE URL" hint="from content/credentials/">
          <input value={item.image || ''} onChange={e => onUpdate('image', e.target.value || null)}
            placeholder="https://..." style={monoInput} />
        </Field>
        <Field label="CREDENTIAL URL" hint="optional">
          <input value={item.credential || ''} onChange={e => onUpdate('credential', e.target.value || null)}
            placeholder="https://..." style={monoInput} />
        </Field>
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

export default function CredentialsEditor() {
  const { data, addCredential, updateCredential, removeCredential } = useData()
  const items = data.credentials || []
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState(blank)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <p style={{
        fontFamily: 'JetBrains Mono', fontSize: 10, color: '#7a6a3a', lineHeight: 1.6,
        background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)',
        borderRadius: 6, padding: '10px 12px',
      }}>
        Earned credentials only. Anything still in progress or planned belongs in the
        hero bio, not here — a section that mostly lists intentions reads as a wishlist.
      </p>

      {items.map(item => (
        <CredentialRow key={item.id} item={item}
          onUpdate={(field, val) => updateCredential(item.id, field, val)}
          onRemove={() => removeCredential(item.id)} />
      ))}

      {adding ? (
        <div style={{ background: '#0d0d0d', border: '1px dashed #2563eb', borderRadius: 8, padding: 20 }}>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#2563eb', marginBottom: 16 }}>NEW CREDENTIAL</p>
          <CredentialRow item={draft}
            onUpdate={(field, val) => setDraft(d => ({ ...d, [field]: val }))}
            onRemove={() => { setAdding(false); setDraft(blank) }} />
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button onClick={() => { addCredential(draft); setAdding(false); setDraft(blank) }}
              style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, padding: '9px 20px', cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: 12 }}>
              Save
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
        }}>+ Add credential</button>
      )}
    </div>
  )
}
