import { useData } from '../../context/DataContext'

function Field({ label, value, onChange, multiline }) {
  const base = {
    width: '100%', background: '#0a0a0a', border: '1px solid #2a2a2a',
    borderRadius: 4, padding: '9px 12px', color: '#fff', fontSize: 13,
    fontFamily: 'inherit', outline: 'none', resize: multiline ? 'vertical' : 'none',
  }
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#555', display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      {multiline
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} style={base} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} style={base} />
      }
    </div>
  )
}

export default function HeroEditor() {
  const { data, updateHero } = useData()
  const h = data.hero

  return (
    <div>
      <Field label="NAME" value={h.name} onChange={v => updateHero('name', v)} />
      <Field label="TITLE LINE" value={h.title} onChange={v => updateHero('title', v)} />
      <Field label="BIO" value={h.bio} onChange={v => updateHero('bio', v)} multiline />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="STATUS CARD" value={h.status} onChange={v => updateHero('status', v)} />
        <Field label="LOCATION" value={h.location} onChange={v => updateHero('location', v)} />
        <Field label="UNIVERSITY" value={h.university} onChange={v => updateHero('university', v)} />
        <Field label="CGPA" value={h.cgpa} onChange={v => updateHero('cgpa', v)} />
      </div>
    </div>
  )
}
