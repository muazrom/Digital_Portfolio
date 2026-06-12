const HASH_KEY = 'portfolio_admin_hash'
const SESSION_KEY = 'portfolio_admin_session'

// Default password hash for 'workshop2026'
const DEFAULT_HASH = 'c5ac06037da727a075d2aa011844ac0b386776b027e1fc62ae45453c4a0b483d'

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function checkPassword(password) {
  const stored = localStorage.getItem(HASH_KEY) || DEFAULT_HASH
  const hashed = await sha256(password)
  return hashed === stored
}

export async function changePassword(oldPassword, newPassword) {
  const valid = await checkPassword(oldPassword)
  if (!valid) throw new Error('Current password incorrect')
  const hashed = await sha256(newPassword)
  localStorage.setItem(HASH_KEY, hashed)
}

export function isAuthenticated() {
  // Never auto-authenticate on page load — always prompt on fresh visit
  return false
}

export function setAuthenticated(val) {
  if (val) sessionStorage.setItem(SESSION_KEY, 'true')
  else sessionStorage.removeItem(SESSION_KEY)
}
