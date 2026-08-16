import { useState } from 'react'
import { checkPassword, setAuthenticated } from './auth'

export default function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const valid = await checkPassword(password)
    if (valid) {
      setAuthenticated(true)
      onSuccess()
    } else {
      setError('Invalid password.')
      setPassword('')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundImage: 'radial-gradient(circle, var(--border-subtle) 1px, transparent 1px)',
      backgroundSize: '24px 24px',
    }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '40px 36px', width: 340,
        position: 'relative',
      }}>
        {/* Top accent */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2, borderRadius: '10px 10px 0 0',
          background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
        }} />

        <p style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--accent)', marginBottom: 8 }}>
          ADMIN_ACCESS // muazrom.my
        </p>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 28 }}>
          Workshop Control
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-faint)', display: 'block', marginBottom: 6 }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              placeholder="Enter password"
              style={{
                width: '100%', background: 'var(--bg)',
                border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
                borderRadius: 4, padding: '10px 14px',
                color: 'var(--text)', fontSize: 13,
                fontFamily: 'JetBrains Mono',
                outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'}
            />
            {error && (
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--danger)', marginTop: 6 }}>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              background: 'var(--accent)', color: 'var(--text)',
              border: 'none', borderRadius: 4, padding: '11px',
              fontFamily: 'JetBrains Mono', fontSize: 12,
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              opacity: loading || !password ? 0.5 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Verifying...' : 'Enter Workshop →'}
          </button>
        </form>

        <p style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--border-strong)', marginTop: 20, textAlign: 'center' }}>
          Session ends when browser tab is closed
        </p>
      </div>
    </div>
  )
}
