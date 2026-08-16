import { useState } from 'react'
import { setAuthenticated, changePassword } from './auth'
import { useData } from '../context/DataContext'
import HeroEditor from './editors/HeroEditor'
import SkillsEditor from './editors/SkillsEditor'
import ProjectsEditor from './editors/ProjectsEditor'
import ExperienceEditor from './editors/ExperienceEditor'
import CredentialsEditor from './editors/CredentialsEditor'

const TABS = [
  { id: 'hero', label: 'Hero', desc: 'Name, title, bio, status cards' },
  { id: 'skills', label: 'Skills & Tools', desc: 'Stations, tools, proficiency' },
  { id: 'projects', label: 'Projects', desc: 'Add, edit, remove projects' },
  { id: 'experience', label: 'Experience', desc: 'Activities and roles' },
  { id: 'credentials', label: 'Credentials', desc: 'Badges and certificates earned' },
  { id: 'settings', label: 'Settings', desc: 'Password, reset data' },
]

function SettingsPanel({ onLogout }) {
  const { resetToDefaults } = useData()
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [msg, setMsg] = useState(null)

  const handleChange = async () => {
    if (newPw !== confirmPw) { setMsg({ type: 'error', text: 'Passwords do not match.' }); return }
    if (newPw.length < 8) { setMsg({ type: 'error', text: 'Password must be at least 8 characters.' }); return }
    try {
      await changePassword(oldPw, newPw)
      setMsg({ type: 'success', text: 'Password changed. You will be logged out.' })
      setTimeout(() => { setAuthenticated(false); window.location.hash = '' }, 2000)
    } catch (e) {
      setMsg({ type: 'error', text: e.message })
    }
  }

  const handleReset = () => {
    if (window.confirm('Reset all content to defaults? This cannot be undone.')) {
      resetToDefaults()
      setMsg({ type: 'success', text: 'Content reset to defaults.' })
    }
  }

  const input = {
    width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: 4, padding: '9px 12px', color: 'var(--text)', fontSize: 13,
    fontFamily: 'JetBrains Mono', outline: 'none', marginBottom: 10,
  }

  return (
    <div style={{ maxWidth: 400 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 20 }}>Change Password</h3>
      <input type="password" placeholder="Current password" value={oldPw} onChange={e => setOldPw(e.target.value)} style={input} />
      <input type="password" placeholder="New password (min 8 chars)" value={newPw} onChange={e => setNewPw(e.target.value)} style={input} />
      <input type="password" placeholder="Confirm new password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} style={input} />
      {msg && (
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: msg.type === 'error' ? 'var(--danger)' : 'var(--ok)', marginBottom: 12 }}>
          {msg.text}
        </p>
      )}
      <button onClick={handleChange} style={{
        background: 'var(--accent)', color: 'var(--text)', border: 'none', borderRadius: 4,
        padding: '9px 20px', cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: 12,
        marginBottom: 40,
      }}>Update Password</button>

      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Danger Zone</h3>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={handleReset} style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
          color: 'var(--danger)', borderRadius: 4, padding: '9px 16px',
          cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: 12,
        }}>Reset to Defaults</button>
        <button onClick={() => { setAuthenticated(false); window.location.hash = '' }} style={{
          background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 4,
          padding: '9px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: 12,
        }}>Log Out</button>
      </div>
    </div>
  )
}

export default function AdminDashboard({ onLogout }) {
  const [tab, setTab] = useState('hero')
  const activeTab = TABS.find(t => t.id === tab)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <header style={{
        borderBottom: '1px solid var(--border-subtle)', padding: '0 28px', height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-blur)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            background: 'rgba(var(--accent-rgb), 0.15)', border: '1px solid rgba(var(--accent-rgb), 0.3)',
            borderRadius: 3, padding: '2px 7px',
            fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--accent)',
          }}>ADMIN</span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text)' }}>
            muazrom<span style={{ color: 'var(--accent)' }}>.my</span> — Workshop Control
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/" style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-faint)', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-faint)'}>
            ← View Site
          </a>
          <button
            onClick={() => { setAuthenticated(false); window.location.hash = '' }}
            style={{
              background: 'none', border: '1px solid var(--border)', color: 'var(--text-faint)',
              borderRadius: 4, padding: '5px 12px', cursor: 'pointer',
              fontFamily: 'JetBrains Mono', fontSize: 11,
            }}>
            Log Out
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <nav style={{
          width: 220, borderRight: '1px solid var(--border-subtle)', padding: '24px 0',
          position: 'sticky', top: 52, height: 'calc(100vh - 52px)',
          overflowY: 'auto', flexShrink: 0,
        }}>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--border-strong)', padding: '0 20px', marginBottom: 10 }}>
            SECTIONS
          </p>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '10px 20px', background: tab === t.id ? 'rgba(var(--accent-rgb), 0.08)' : 'none',
                border: 'none', borderLeft: `2px solid ${tab === t.id ? 'var(--accent)' : 'transparent'}`,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: tab === t.id ? 'var(--text)' : 'var(--text-dim)', marginBottom: 2 }}>
                {t.label}
              </span>
              <span style={{ display: 'block', fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--border-strong)' }}>
                {t.desc}
              </span>
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
          <div style={{ maxWidth: 800 }}>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--accent)', marginBottom: 6 }}>
              EDITING // {activeTab.label.toUpperCase()}
            </p>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              {activeTab.label}
            </h2>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--border-strong)', marginBottom: 28 }}>
              {activeTab.desc} — changes save automatically
            </p>

            {tab === 'hero' && <HeroEditor />}
            {tab === 'skills' && <SkillsEditor />}
            {tab === 'projects' && <ProjectsEditor />}
            {tab === 'experience' && <ExperienceEditor />}
            {tab === 'credentials' && <CredentialsEditor />}
            {tab === 'settings' && <SettingsPanel onLogout={onLogout} />}
          </div>
        </main>
      </div>
    </div>
  )
}
