import { useState } from 'react'
import { useData } from '../../context/DataContext'

const STATUSES = ['Live', 'In Development', 'Ongoing', 'Completed']
const statusColor = { Live: '#4ade80', 'In Development': '#facc15', Ongoing: '#60a5fa', Completed: '#888' }

const blank = { name: '', status: 'In Development', description: '', stack: [], github: '', live: '', image: '', caseStudy: '' }

function ProjectCard({ project, onUpdate, onRemove }) {
  const [stackInput, setStackInput] = useState('')
  const s = project

  return (
    <div style={{
      background: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: 8, padding: 20,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#555', display: 'block', marginBottom: 5 }}>NAME</label>
          <input value={s.name} onChange={e => onUpdate('name', e.target.value)}
            style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 4, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none' }} />
        </div>
        <div>
          <label style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#555', display: 'block', marginBottom: 5 }}>STATUS</label>
          <select value={s.status} onChange={e => onUpdate('status', e.target.value)}
            style={{
              width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 4,
              padding: '8px 12px', color: statusColor[s.status], fontSize: 12,
              fontFamily: 'JetBrains Mono', outline: 'none',
            }}>
            {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#555', display: 'block', marginBottom: 5 }}>DESCRIPTION</label>
        <textarea rows={3} value={s.description} onChange={e => onUpdate('description', e.target.value)}
          style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 4, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none', resize: 'vertical' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#555', display: 'block', marginBottom: 5 }}>GITHUB URL</label>
          <input value={s.github || ''} onChange={e => onUpdate('github', e.target.value)}
            style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 4, padding: '8px 12px', color: '#fff', fontSize: 12, fontFamily: 'JetBrains Mono', outline: 'none' }} />
        </div>
        <div>
          <label style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#555', display: 'block', marginBottom: 5 }}>LIVE URL</label>
          <input value={s.live || ''} onChange={e => onUpdate('live', e.target.value || null)}
            style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 4, padding: '8px 12px', color: '#fff', fontSize: 12, fontFamily: 'JetBrains Mono', outline: 'none' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#555', display: 'block', marginBottom: 5 }}>SCREENSHOT PATH</label>
          <input value={s.image || ''} onChange={e => onUpdate('image', e.target.value || null)}
            placeholder="/screenshots/name.png"
            style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 4, padding: '8px 12px', color: '#fff', fontSize: 12, fontFamily: 'JetBrains Mono', outline: 'none' }} />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#555', display: 'block', marginBottom: 5 }}>CASE STUDY</label>
        <textarea rows={4} value={s.caseStudy || ''} onChange={e => onUpdate('caseStudy', e.target.value)}
          placeholder="Problem → approach → outcome, in a few sentences."
          style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 4, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none', resize: 'vertical' }} />
      </div>

      {/* Stack */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#555', display: 'block', marginBottom: 8 }}>STACK</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {s.stack.map(tech => (
            <span key={tech} style={{
              background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.15)',
              borderRadius: 3, padding: '3px 8px', fontFamily: 'JetBrains Mono', fontSize: 10, color: '#888',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {tech}
              <button onClick={() => onUpdate('stack', s.stack.filter(t => t !== tech))}
                style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 12, padding: 0, lineHeight: 1 }}>×</button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={stackInput} onChange={e => setStackInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && stackInput.trim()) {
                onUpdate('stack', [...s.stack, stackInput.trim()])
                setStackInput('')
              }
            }}
            placeholder="Add tech… (Enter)"
            style={{
              background: '#111', border: '1px solid #2a2a2a', borderRadius: 4, padding: '7px 12px',
              color: '#fff', fontSize: 12, fontFamily: 'JetBrains Mono', outline: 'none', flex: 1,
            }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onRemove} style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          color: '#ef4444', borderRadius: 4, padding: '6px 14px',
          cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: 11,
        }}>Remove Project</button>
      </div>
    </div>
  )
}

export default function ProjectsEditor() {
  const { data, addProject, updateProject, removeProject } = useData()
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState(blank)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {data.projects.map(p => (
        <ProjectCard
          key={p.id}
          project={p}
          onUpdate={(field, val) => updateProject(p.id, field, val)}
          onRemove={() => removeProject(p.id)}
        />
      ))}

      {adding ? (
        <div style={{ background: '#0d0d0d', border: '1px dashed #2563eb', borderRadius: 8, padding: 20 }}>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#2563eb', marginBottom: 16 }}>NEW PROJECT</p>
          <ProjectCard
            project={draft}
            onUpdate={(field, val) => setDraft(d => ({ ...d, [field]: val }))}
            onRemove={() => { setAdding(false); setDraft(blank) }}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button onClick={() => { addProject(draft); setAdding(false); setDraft(blank) }}
              style={{
                background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4,
                padding: '9px 20px', cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: 12,
              }}>Save Project</button>
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
        }}>+ Add Project</button>
      )}
    </div>
  )
}
