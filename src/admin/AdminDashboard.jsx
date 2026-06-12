import { useState } from 'react'
import { setAuthenticated, changePassword } from './auth'
import { useData } from '../context/DataContext'
import HeroEditor from './editors/HeroEditor'
import SkillsEditor from './editors/SkillsEditor'
import ProjectsEditor from './editors/ProjectsEditor'
import ExperienceEditor from './editors/ExperienceEditor'
import BadgesEditor from './editors/BadgesEditor'

const TABS = [
  { id: 'hero', label: 'Hero', desc: 'Name, title, bio, status cards' },
  { id: 'skills', label: 'Skills & Tools', desc: 'Stations, tools, proficiency' },
  { id: 'projects', label: 'Projects', desc: 'Add, edit, remove projects' },
  { id: 'experience', label: 'Experience', desc: 'Activities and roles' },
  { id: 'badges', label: 'Badges & Certs', desc: 'Awards and certificates' },
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
    width: '100%', background: '#0a0a0a', border: '1px solid #2a2a2a',
    borderRadius: 4, padding: '9px 12px', color: '#fff', fontSize: 13,
    fontFamily: 'JetBrains Mono', outline: 'none', marginBottom: 10,
  }

  return (
    <div style={{ maxWidth: 400 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 20 }}>Change Password</h3>
      <input type="password" placeholder="Current password" value={oldPw} onChange={e => setOldPw(e.target.value)} style={input} />
      <input type="password" placeholder="New password (min 8 chars)" value={newPw} onChange={e => setNewPw(e.target.value)} style={input} />
      <input type="password" placeholder="Confirm new password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} style={input} />
      {msg && (
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: msg.type === 'error' ? '#ef4444' : '#4ade80', marginBottom: 12 }}>
          {msg.text}
        </p>
      )}
      <button onClick={handleChange} style={{
        background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4,
        padding: '9px 20px', cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: 12,
        marginBottom: 40,
      }}>Update Password</button>

      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 12 }}>Danger Zone</h3>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={handleReset} style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
          color: '#ef4444', borderRadius: 4, padding: '9px 16px',
          cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: 12,
        }}>Reset to Defaults</button>
        <button onClick={() => { setAuthenticated(false); window.location.hash = '' }} style={{
          background: '#111', border: '1px solid #2a2a2a', color: '#888', borderRadius: 4,
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
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <header style={{
        borderBottom: '1px solid #1e1e1e', padding: '0 28px', height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(10,10,10,0.95)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)',
            borderRadius: 3, padding: '2px 7px',
            fontFamily: 'JetBrains Mono', fontSize: 9, color: '#2563eb',
          }}>ADMIN</span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#fff' }}>
            muazrom<span style={{ color: '#2563eb' }}>.my</span> — Workshop Control
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/" style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#555', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = '#555'}>
            ← View Site
          </a>
          <button
            onClick={() => { setAuthenticated(false); window.location.hash = '' }}
            style={{
              background: 'none', border: '1px solid #2a2a2a', color: '#555',
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
          width: 220, borderRight: '1px solid #1e1e1e', padding: '24px 0',
          position: 'sticky', top: 52, height: 'calc(100vh - 52px)',
          overflowY: 'auto', flexShrink: 0,
        }}>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#333', padding: '0 20px', marginBottom: 10 }}>
            SECTIONS
          </p>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '10px 20px', background: tab === t.id ? 'rgba(37,99,235,0.08)' : 'none',
                border: 'none', borderLeft: `2px solid ${tab === t.id ? '#2563eb' : 'transparent'}`,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: tab === t.id ? '#fff' : '#666', marginBottom: 2 }}>
                {t.label}
              </span>
              <span style={{ display: 'block', fontFamily: 'JetBrains Mono', fontSize: 9, color: '#333' }}>
                {t.desc}
              </span>
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
          <div style={{ maxWidth: 800 }}>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#2563eb', marginBottom: 6 }}>
              EDITING // {activeTab.label.toUpperCase()}
            </p>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
              {activeTab.label}
            </h2>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#444', marginBottom: 28 }}>
              {activeTab.desc} — changes save automatically
            </p>

            {tab === 'hero' && <HeroEditor />}
            {tab === 'skills' && <SkillsEditor />}
            {tab === 'projects' && <ProjectsEditor />}
            {tab === 'experience' && <ExperienceEditor />}
            {tab === 'badges' && <BadgesEditor />}
            {tab === 'settings' && <SettingsPanel onLogout={onLogout} />}
          </div>
        </main>
      </div>
    </div>
  )
}
