import { useState } from 'react'
import { useData } from '../../context/DataContext'

const RUNGS = ['foundation', 'associate', 'professional']
const DOMAINS = ['network', 'security', 'systems']
const STATUSES = [
  { value: 'earned', label: 'Earned' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'planned', label: 'Planned' },
]
const KINDS = ['path', 'course', 'module', 'lab']

const blankLadder = {
  code: '', name: '', vendor: '', rung: 'associate', domain: 'network',
  status: 'planned', earned: null, target: '', credential: null, image: null,
  why: '', progress: null,
}
const blankLog = {
  name: '', issuer: '', kind: 'course', topic: 'security',
  date: '', credential: null, image: null, writeups: [],
}

const inputStyle = {
  width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 4,
  padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none',
}
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

function RemoveButton({ onRemove }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <button onClick={onRemove} style={{
        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
        color: '#ef4444', borderRadius: 4, padding: '6px 14px',
        cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: 11,
      }}>Remove</button>
    </div>
  )
}

function LadderRow({ item, onUpdate, onRemove }) {
  return (
    <div style={{ background: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: 8, padding: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Field label="CODE">
          <input value={item.code} onChange={e => onUpdate('code', e.target.value)}
            placeholder="CCNA" style={inputStyle} />
        </Field>
        <Field label="VENDOR">
          <input value={item.vendor} onChange={e => onUpdate('vendor', e.target.value)}
            placeholder="Cisco" style={inputStyle} />
        </Field>
      </div>

      <div style={{ marginBottom: 12 }}>
        <Field label="FULL NAME">
          <input value={item.name} onChange={e => onUpdate('name', e.target.value)} style={inputStyle} />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Field label="STATUS">
          <select value={item.status} onChange={e => onUpdate('status', e.target.value)} style={selectStyle}>
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </Field>
        <Field label="RUNG">
          <select value={item.rung} onChange={e => onUpdate('rung', e.target.value)} style={selectStyle}>
            {RUNGS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="DOMAIN">
          <select value={item.domain} onChange={e => onUpdate('domain', e.target.value)} style={selectStyle}>
            {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Field label="EARNED" hint="YYYY-MM, only if earned">
          <input value={item.earned || ''} onChange={e => onUpdate('earned', e.target.value || null)}
            placeholder="2027-06" style={inputStyle} />
        </Field>
        <Field label="TARGET" hint="if not earned">
          <input value={item.target || ''} onChange={e => onUpdate('target', e.target.value || null)}
            placeholder="Mid 2027" style={inputStyle} />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Field label="PROGRESS LABEL" hint="in progress only">
          <input value={item.progress?.label || ''}
            onChange={e => onUpdate('progress', e.target.value
              ? { ...(item.progress || {}), label: e.target.value }
              : null)}
            placeholder="Studying" style={inputStyle} />
        </Field>
        <Field label="PROGRESS DETAIL" hint="optional">
          <input value={item.progress?.detail || ''}
            onChange={e => onUpdate('progress', {
              ...(item.progress || { label: 'Studying' }),
              detail: e.target.value || null,
            })}
            placeholder="Modules 1-4 of 17" style={inputStyle} />
        </Field>
      </div>

      <div style={{ marginBottom: 12 }}>
        <Field label="WHY" hint="required unless earned — the reasoning is the evidence">
          <textarea value={item.why || ''} onChange={e => onUpdate('why', e.target.value)}
            rows={3} style={{ ...inputStyle, fontSize: 12, lineHeight: 1.6, resize: 'vertical' }} />
        </Field>
      </div>

      <div style={{ marginBottom: 12 }}>
        <Field label="CREDENTIAL URL" hint="only meaningful once earned">
          <input value={item.credential || ''} onChange={e => onUpdate('credential', e.target.value || null)}
            placeholder="https://..." style={{ ...inputStyle, fontSize: 12, fontFamily: 'JetBrains Mono' }} />
        </Field>
      </div>

      <RemoveButton onRemove={onRemove} />
    </div>
  )
}

function LogRow({ item, onUpdate, onRemove }) {
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
            {KINDS.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </Field>
        <Field label="TOPIC">
          <select value={item.topic} onChange={e => onUpdate('topic', e.target.value)} style={selectStyle}>
            {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="DATE" hint="YYYY-MM">
          <input value={item.date} onChange={e => onUpdate('date', e.target.value)}
            placeholder="2026-06" style={inputStyle} />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Field label="IMAGE PATH" hint="optional">
          <input value={item.image || ''} onChange={e => onUpdate('image', e.target.value || null)}
            placeholder="/badges/name.png" style={{ ...inputStyle, fontSize: 12, fontFamily: 'JetBrains Mono' }} />
        </Field>
        <Field label="CREDENTIAL URL" hint="optional">
          <input value={item.credential || ''} onChange={e => onUpdate('credential', e.target.value || null)}
            placeholder="https://..." style={{ ...inputStyle, fontSize: 12, fontFamily: 'JetBrains Mono' }} />
        </Field>
      </div>

      <RemoveButton onRemove={onRemove} />
    </div>
  )
}

export default function CredentialsEditor() {
  const { data, addCredential, updateCredential, removeCredential } = useData()
  const [bucket, setBucket] = useState('ladder')
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState(blankLadder)

  const isLadder = bucket === 'ladder'
  const items = data.credentials?.[bucket] || []
  const blank = isLadder ? blankLadder : blankLog
  const Row = isLadder ? LadderRow : LogRow

  const switchBucket = (next) => {
    setBucket(next)
    setAdding(false)
    setDraft(next === 'ladder' ? blankLadder : blankLog)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {[
          { id: 'ladder', label: 'Route', desc: 'exam-based certs only' },
          { id: 'log', label: 'Learning log', desc: 'coursework & completions' },
        ].map(b => (
          <button key={b.id} onClick={() => switchBucket(b.id)} style={{
            flex: 1, textAlign: 'left', padding: '10px 14px', borderRadius: 6, cursor: 'pointer',
            background: bucket === b.id ? 'rgba(37,99,235,0.12)' : 'transparent',
            border: `1px solid ${bucket === b.id ? 'rgba(37,99,235,0.4)' : '#2a2a2a'}`,
            color: bucket === b.id ? '#93b4ff' : '#666',
            fontFamily: 'JetBrains Mono', fontSize: 12,
          }}>
            {b.label}
            <span style={{ display: 'block', fontSize: 9, color: '#555', marginTop: 3 }}>{b.desc}</span>
          </button>
        ))}
      </div>

      {isLadder && (
        <p style={{
          fontFamily: 'JetBrains Mono', fontSize: 10, color: '#7a6a3a', lineHeight: 1.6,
          background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 6, padding: '10px 12px',
        }}>
          Exam-based, industry-recognised certifications only. Course-completion badges go in the
          learning log — mixing them is what this split exists to prevent.
        </p>
      )}

      {items.map(item => (
        <Row key={item.id} item={item}
          onUpdate={(field, val) => updateCredential(bucket, item.id, field, val)}
          onRemove={() => removeCredential(bucket, item.id)} />
      ))}

      {adding ? (
        <div style={{ background: '#0d0d0d', border: '1px dashed #2563eb', borderRadius: 8, padding: 20 }}>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#2563eb', marginBottom: 16 }}>
            NEW {isLadder ? 'CERTIFICATION' : 'LOG ENTRY'}
          </p>
          <Row item={draft}
            onUpdate={(field, val) => setDraft(d => ({ ...d, [field]: val }))}
            onRemove={() => { setAdding(false); setDraft(blank) }} />
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button onClick={() => { addCredential(bucket, draft); setAdding(false); setDraft(blank) }}
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
        }}>+ Add {isLadder ? 'certification' : 'log entry'}</button>
      )}
    </div>
  )
}
