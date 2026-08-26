import { publishedWriteups } from '../content/writeups'
import { Chip, SEV } from './console/widgets'

// An event log, because that is what these actually are: dated entries, newest
// first, each one a thing that happened while studying. The card layout this
// replaces made three write-ups look like three featured articles; a log makes
// ten of them look like a track record, which is the honest reading.
const PREVIEW_COUNT = 6

// Tags are freeform, so the log derives its severity column from the one field
// that is always present and always means the same thing: the platform the lab
// came from. Everything self-directed reads as a personal lab.
const sourceOf = (w) => w.source?.platform || 'Self-directed'

export default function FieldNotes() {
  const all = publishedWriteups()
  // Nothing published yet? Render nothing. An empty section with a promise in it
  // is weaker than no section at all.
  if (all.length === 0) return null

  const recent = all.slice(0, PREVIEW_COUNT)

  return (
    <div>
      <p className="font-mono console-panel-caption">
        What I worked out while studying, including what I got wrong first.
      </p>

      <div className="console-log">
        <div className="console-log-head font-mono">
          <span>DATE</span>
          <span>SOURCE</span>
          <span>ENTRY</span>
          <span className="console-log-right">READ</span>
        </div>

        {recent.map((w) => (
          <a key={w.slug} href={`#/writeups/${w.slug}`} className="console-log-row">
            <span className="font-mono console-log-date">{w.date}</span>
            <span className="console-log-src">
              <Chip color={w.source?.platform ? SEV.link : SEV.idle}>{sourceOf(w)}</Chip>
            </span>
            <span className="console-log-entry">
              <span className="console-log-title">{w.title}</span>
              <span className="console-log-summary">{w.summary}</span>
            </span>
            <span className="font-mono console-log-right console-log-mins">{w.minutes}m</span>
          </a>
        ))}
      </div>

      {all.length > PREVIEW_COUNT && (
        <a href="#/writeups" className="font-mono console-log-more">
          Open full archive — {all.length} entries →
        </a>
      )}
    </div>
  )
}
