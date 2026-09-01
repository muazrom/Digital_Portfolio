import Icon from './Icon'
import { useEffect, useState } from 'react'
import { useData } from '../context/DataContext'
import { useWindowSize } from '../hooks/useWindowSize'
import { credentialRacks, KIND_LABEL } from '../lib/metrics'

// `kind` drives the accent and the unit label — one field, not the old `tier`,
// which mixed credential rigor with artifact type and needed a sort shim to
// untangle. 'certification' is reserved for exam-based certs; when CCNA lands it
// renders in accent blue, visibly distinct from a course badge.
//
// `path` is teal rather than the green it used to share with `course`. A track
// rack puts a path capstone directly above the courses that make it up, and two
// identical greens made the capstone unreadable as the thing containing them —
// it also flattened Overview's CREDENTIALS BY KIND bar into one green run.
export const kindMeta = {
  certification: { label: KIND_LABEL.certification, icon: 'award',  main: '#2563eb', light: '#93b4ff' },
  path:          { label: KIND_LABEL.path,          icon: 'book',   main: '#14b8a6', light: '#5eead4' },
  course:        { label: KIND_LABEL.course,        icon: 'notes',  main: '#22c55e', light: '#86efac' },
  module:        { label: KIND_LABEL.module,        icon: 'chip',   main: '#9ca3af', light: '#d4d8df' },
}
const metaOf = (kind) => kindMeta[kind] || kindMeta.course

// Year only. The dates are stored as ISO 'YYYY-MM', but the month adds nothing
// to a credential — what matters is which year it was earned.
const formatDate = (iso) => (iso ? String(iso).split('-')[0] : '')

// A public verification URL is the only thing that makes a credential checkable
// by someone else, so the LED reports that fact rather than decorating the row.
const isVerifiable = (c) => Boolean(c.credential)

/* ─────────────────────────── chassis ─────────────────────────── */

function Rail({ units }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: 12, flexShrink: 0, background: '#141414',
        border: '1px solid #2e2e2e', borderRadius: 3,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-around', alignItems: 'center', padding: '8px 0',
      }}
    >
      {Array.from({ length: Math.max(4, units * 2) }, (_, i) => (
        <span key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: '#333' }} />
      ))}
    </div>
  )
}

function Unit({ item, onOpen, compact, lead }) {
  const t = metaOf(item.kind)
  const [hover, setHover] = useState(false)
  const verifiable = isVerifiable(item)

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-haspopup="dialog"
      style={{
        width: '100%', textAlign: 'left', cursor: 'pointer',
        background: hover ? '#181818' : '#141414',
        // A capstone sits above the courses that earn it, so it carries the
        // track's own accent rather than the shared unit border.
        border: `1px solid ${hover ? 'rgba(37,99,235,0.45)' : lead ? t.main + '66' : '#2e2e2e'}`,
        borderRadius: 3, padding: compact ? '11px 12px' : '12px 14px',
        display: 'flex', alignItems: 'center', gap: compact ? 10 : 14,
        flexWrap: compact ? 'wrap' : 'nowrap',
        transition: 'background 0.18s, border-color 0.18s',
        fontFamily: 'JetBrains Mono',
      }}
    >
      {lead && (
        <span aria-hidden="true" style={{ color: t.main, fontSize: 10, flexShrink: 0, marginRight: -4 }}>▸</span>
      )}
      <span
        title={verifiable ? 'Independently verifiable' : 'No public verification link'}
        style={{
          width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
          background: verifiable ? '#22c55e' : '#4a4a4a',
          boxShadow: verifiable ? '0 0 6px rgba(34,197,94,0.7)' : 'none',
        }}
      />

      <span style={{ color: t.main, display: 'flex' }}><Icon name={t.icon} size={14} /></span>

      <span style={{
        fontSize: 9, letterSpacing: '0.1em', color: t.main,
        width: compact ? 'auto' : 52, flexShrink: 0,
      }}>
        {t.label}
      </span>

      <span style={{
        fontFamily: 'Space Grotesk, sans-serif', fontSize: compact ? 13 : 14,
        fontWeight: 500, color: '#eaeaea',
        flex: compact ? '1 1 100%' : 1, minWidth: 0,
        order: compact ? 3 : 0,
      }}>
        {item.name}
      </span>

      <span style={{
        fontSize: 9.5, color: '#666', flexShrink: 0,
        order: compact ? 4 : 0,
      }}>
        {item.issuer} · {formatDate(item.date)}
      </span>

      <span aria-hidden="true" style={{
        fontSize: 10, color: hover ? '#93b4ff' : '#3f3f3f', flexShrink: 0,
        transition: 'color 0.18s',
      }}>
        ⤢
      </span>
    </button>
  )
}

// A step named by a track but not yet earned. Deliberately not a button: there
// is no credential behind it to open, so it stays out of the tab order and can't
// imply one exists. Dashed, dimmed, a hollow LED and an em dash where the year
// goes — it has to be unmistakably not-held at a glance.
function PendingUnit({ label, kind, compact, lead }) {
  const t = metaOf(kind)

  return (
    <div
      style={{
        width: '100%',
        background: 'transparent',
        border: `1px dashed ${lead ? t.main + '4d' : '#242424'}`,
        borderRadius: 3, padding: compact ? '11px 12px' : '12px 14px',
        display: 'flex', alignItems: 'center', gap: compact ? 10 : 14,
        flexWrap: compact ? 'wrap' : 'nowrap',
        fontFamily: 'JetBrains Mono', opacity: lead ? 0.75 : 0.55,
      }}
    >
      {lead && (
        <span aria-hidden="true" style={{ color: t.main, fontSize: 10, flexShrink: 0, marginRight: -4 }}>▸</span>
      )}

      <span
        title="Not earned yet"
        style={{
          width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
          border: '1px solid #4a4a4a', background: 'transparent',
        }}
      />

      <span style={{ color: lead ? t.main : '#4a4a4a', display: 'flex' }}>
        <Icon name={lead ? t.icon : 'chip'} size={14} />
      </span>

      <span style={{
        fontSize: 9, letterSpacing: '0.1em', color: lead ? t.main : '#4a4a4a',
        width: compact ? 'auto' : 52, flexShrink: 0,
      }}>
        {lead ? t.label : '—'}
      </span>

      <span style={{
        fontFamily: 'Space Grotesk, sans-serif', fontSize: compact ? 13 : 14,
        fontWeight: 500, color: '#6f6f6f',
        flex: compact ? '1 1 100%' : 1, minWidth: 0,
        order: compact ? 3 : 0,
      }}>
        {label}
      </span>

      <span style={{
        fontSize: 9.5, color: '#4a4a4a', flexShrink: 0, letterSpacing: '0.08em',
        order: compact ? 4 : 0,
      }}>
        {lead ? 'pending' : 'not started'}
      </span>
    </div>
  )
}

/* ─────────────────────────── rack ─────────────────────────── */

function Rack({ rack, index, onOpen, compact }) {
  // Capstone first, then the steps that earn it. A pending step has no
  // credential behind it, so it renders as a slot rather than a unit.
  const rows = rack.steps.length + (rack.capstone || rack.target ? 1 : 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <p className="font-mono text-xs text-muted">
          RACK_{String(index + 1).padStart(2, '0')} // {rack.title.toUpperCase()}
        </p>
        <p className="font-mono" style={{ fontSize: 9.5, color: '#565656', marginTop: 3 }}>
          {rack.meta}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
        {!compact && <Rail units={rows} />}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
          {rack.capstone && <Unit item={rack.capstone} onOpen={onOpen} compact={compact} lead />}
          {rack.target && (
            <PendingUnit label={rack.target.name} kind={rack.target.kind} compact={compact} lead />
          )}
          {rack.steps.map((step, i) =>
            step.credential
              ? <Unit key={step.credential.id} item={step.credential} onOpen={onOpen} compact={compact} />
              : <PendingUnit key={`pending-${i}`} label={step.label} compact={compact} />
          )}
        </div>
        {!compact && <Rail units={rows} />}
      </div>
    </div>
  )
}

/* ─────────────────────────── detail panel ─────────────────────────── */

function DetailPanel({ item, onClose }) {
  const [imgError, setImgError] = useState(false)
  const t = metaOf(item.kind)

  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
        zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 420, maxHeight: '85vh', overflowY: 'auto',
        background: '#111', border: '1px solid rgba(37,99,235,0.5)', borderRadius: 14,
        padding: 20, display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1.25 }}>
              {item.name}
            </h3>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#888', marginTop: 5 }}>
              {item.issuer}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close"
            style={{ background: 'none', border: 'none', color: '#888', fontSize: 18, cursor: 'pointer', lineHeight: 1, flexShrink: 0 }}>
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'JetBrains Mono', fontSize: 8.5, letterSpacing: '0.1em',
            color: t.light, border: `1px solid ${t.main}`, padding: '3px 9px', borderRadius: 99,
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
            <Icon name={t.icon} size={11} /> {t.label}
          </span>
          <span style={{
            fontFamily: 'JetBrains Mono', fontSize: 8.5, letterSpacing: '0.1em',
            color: '#777', border: '1px solid #2a2a2a', padding: '3px 9px', borderRadius: 99,
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
            <Icon name="calendar" size={11} /> {formatDate(item.date)}
          </span>
        </div>

        {/* Badge art varies wildly in size and aspect (192px square through to a
            1354x959 landscape certificate), so contain it and never upscale. */}
        <div style={{
          background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: 8,
          minHeight: 140, padding: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {item.image && !imgError ? (
            <img
              src={item.image}
              alt={item.name}
              onError={() => setImgError(true)}
              style={{
                maxWidth: 'min(100%, 240px)', maxHeight: 220,
                width: 'auto', height: 'auto', objectFit: 'contain',
              }}
            />
          ) : (
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: 9.5, color: '#555' }}>
              No image available
            </p>
          )}
        </div>

        <div style={{ paddingTop: 10, borderTop: '1px solid #1e1e1e' }}>
          {item.credential ? (
            <a href={item.credential} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#2563eb', textDecoration: 'none' }}>
              Verify credential ↗
            </a>
          ) : (
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#555' }}>
              No public verification link
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────── section ─────────────────────────── */

export default function Credentials() {
  const { data } = useData()
  const [open, setOpen] = useState(null)
  // Same hook Projects.jsx uses, rather than a second hand-rolled resize listener.
  const { w } = useWindowSize()
  const compact = w < 640

  const items = data.credentials || []
  if (items.length === 0) return null

  // One rack per track, then whatever isn't part of one. See credentialRacks()
  // for why a track with nothing earned never appears here.
  const racks = credentialRacks(items)

  return (
    <section className="relative">
      <div className="max-w-5xl mx-auto px-6">
        <p className="font-mono text-xs text-muted mb-10">
          {racks.length} rack{racks.length === 1 ? '' : 's'} · select a unit for details
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
          {racks.map((rack, i) => (
            <Rack key={rack.id} rack={rack} index={i} onOpen={setOpen} compact={compact} />
          ))}
        </div>
      </div>

      {open && <DetailPanel item={open} onClose={() => setOpen(null)} />}
    </section>
  )
}
