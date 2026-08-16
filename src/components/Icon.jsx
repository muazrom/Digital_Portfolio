// Neutral geometric line icons, hand-drawn rather than a package.
//
// Brand marks were considered and rejected: they carry trademark questions and
// they'd clash with the site's blueprint/line-art feel. These are all one house
// style — 24x24, no fill, currentColor stroke at 1.5 — so an icon picks up the
// accent of whatever it sits next to without being told.
//
// No dependency, for the same reason the markdown renderer is hand-rolled: this
// is ~25 glyphs, and it would otherwise be the only runtime package beyond React.

const paths = {
  // — networking
  network: <><circle cx="12" cy="5" r="2.4" /><circle cx="5" cy="19" r="2.4" /><circle cx="19" cy="19" r="2.4" /><path d="M12 7.4v4.2M12 11.6 6.4 17M12 11.6 17.6 17" /></>,
  router: <><rect x="3" y="13" width="18" height="7" rx="1.6" /><path d="M6.5 16.5h.01M9.5 16.5h.01M17.5 16.5h2M12 10V6M12 6l-2.5 2M12 6l2.5 2" /></>,
  switch: <><rect x="3" y="8" width="18" height="9" rx="1.6" /><path d="M6.5 12.5v1.5M9.5 12.5v1.5M12 12.5v1.5M14.5 12.5v1.5M17.5 12.5v1.5" /></>,
  cloud: <><path d="M7 18h10a3.6 3.6 0 0 0 .4-7.2A5.4 5.4 0 0 0 7 11.4 3.4 3.4 0 0 0 7 18Z" /></>,
  globe: <><circle cx="12" cy="12" r="8.4" /><path d="M3.6 12h16.8M12 3.6c2.1 2.3 3.2 5.3 3.2 8.4s-1.1 6.1-3.2 8.4c-2.1-2.3-3.2-5.3-3.2-8.4S9.9 5.9 12 3.6Z" /></>,

  // — security
  shield: <><path d="M12 3.4 19 6v5.6c0 4-2.8 7.5-7 8.9-4.2-1.4-7-4.9-7-8.9V6l7-2.6Z" /></>,
  lock: <><rect x="5" y="10.5" width="14" height="9.5" rx="1.8" /><path d="M8.4 10.5V7.8a3.6 3.6 0 0 1 7.2 0v2.7" /></>,
  key: <><circle cx="8" cy="12" r="3.6" /><path d="M11.6 12H21M18 12v3M15 12v2.2" /></>,

  // — systems
  server: <><rect x="3.5" y="4" width="17" height="6" rx="1.4" /><rect x="3.5" y="14" width="17" height="6" rx="1.4" /><path d="M7 7h.01M7 17h.01" /></>,
  chip: <><rect x="7" y="7" width="10" height="10" rx="1.4" /><path d="M10 3.6v3.4M14 3.6v3.4M10 17v3.4M14 17v3.4M3.6 10H7M3.6 14H7M17 10h3.4M17 14h3.4" /></>,
  monitor: <><rect x="3" y="4.5" width="18" height="12" rx="1.6" /><path d="M9 20h6M12 16.5V20" /></>,
  windows: <><path d="M4 6.5 11 5.4v6.1H4zM13 5.1 20 4v7.5h-7zM4 12.5h7v6.1L4 17.6zM13 12.5h7V20l-7-1.1z" /></>,

  // — code and tooling
  terminal: <><rect x="3" y="4.5" width="18" height="15" rx="1.8" /><path d="M7 9.5 10 12l-3 2.5M12.5 15h4.5" /></>,
  code: <><path d="m8.5 8.5-4 3.5 4 3.5M15.5 8.5l4 3.5-4 3.5M13.5 5.5l-3 13" /></>,
  wrench: <><path d="M15.6 4.4a5 5 0 0 0-6.2 6.4l-5.2 5.2a1.8 1.8 0 0 0 0 2.6l1.2 1.2a1.8 1.8 0 0 0 2.6 0l5.2-5.2a5 5 0 0 0 6.4-6.2l-3 3-2.8-.7-.7-2.8 2.5-3.5Z" /></>,
  gitBranch: <><circle cx="7" cy="5.5" r="2.2" /><circle cx="7" cy="18.5" r="2.2" /><circle cx="17" cy="9.5" r="2.2" /><path d="M7 7.7v8.6M17 11.7c0 3-2.6 4.6-6.2 4.9" /></>,
  palette: <><path d="M12 3.6a8.4 8.4 0 0 0 0 16.8c1.1 0 1.8-.8 1.8-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.1 0-.9.8-1.7 1.8-1.7h1.5a4.3 4.3 0 0 0 4.3-4.3c0-3.7-3.7-6.8-8.4-6.8Z" /><circle cx="8" cy="10" r="1" /><circle cx="12" cy="7.5" r="1" /><circle cx="16" cy="10" r="1" /></>,
  table: <><rect x="3.5" y="4.5" width="17" height="15" rx="1.6" /><path d="M3.5 9.5h17M9.5 9.5v10M15 9.5v10" /></>,

  // — diagnostics and lab
  search: <><circle cx="11" cy="11" r="6.4" /><path d="m15.6 15.6 4.4 4.4" /></>,
  flask: <><path d="M9.5 3.5v5.2L4.8 17a1.9 1.9 0 0 0 1.6 2.9h11.2a1.9 1.9 0 0 0 1.6-2.9l-4.7-8.3V3.5" /><path d="M8.5 3.5h7M7.6 13.5h8.8" /></>,
  pulse: <><path d="M3 12h4l2.5-6 4 12L16 12h5" /></>,

  // — content and meta
  notes: <><path d="M6 3.6h9.5L20 8.1V20a1.4 1.4 0 0 1-1.4 1.4H6A1.4 1.4 0 0 1 4.6 20V5A1.4 1.4 0 0 1 6 3.6Z" /><path d="M15 3.6V8h4.4M8 12.5h8M8 16h5" /></>,
  book: <><path d="M4.5 5.2A1.6 1.6 0 0 1 6.1 3.6H19v14.8H6.1a1.6 1.6 0 0 0-1.6 1.6z" /><path d="M4.5 18.4A1.6 1.6 0 0 1 6.1 20H19" /></>,
  folder: <><path d="M3.6 6.6A1.6 1.6 0 0 1 5.2 5h4l2 2.6h7.6a1.6 1.6 0 0 1 1.6 1.6v8.2a1.6 1.6 0 0 1-1.6 1.6H5.2a1.6 1.6 0 0 1-1.6-1.6Z" /></>,
  tag: <><path d="M3.8 11V5a1.2 1.2 0 0 1 1.2-1.2h6l9.2 9.2a1.4 1.4 0 0 1 0 2l-5.2 5.2a1.4 1.4 0 0 1-2 0Z" /><circle cx="8" cy="8" r="1.3" /></>,
  clock: <><circle cx="12" cy="12" r="8.4" /><path d="M12 7.2V12l3.2 2" /></>,
  calendar: <><rect x="3.6" y="5.4" width="16.8" height="15" rx="1.6" /><path d="M3.6 10h16.8M8.4 3.6v3.4M15.6 3.6v3.4" /></>,
  award: <><circle cx="12" cy="9.4" r="5.6" /><path d="m8.6 14.4-1.4 6 4.8-2.4 4.8 2.4-1.4-6" /></>,
  briefcase: <><rect x="3.4" y="7.4" width="17.2" height="12" rx="1.6" /><path d="M9 7.4V5.8a1.4 1.4 0 0 1 1.4-1.4h3.2A1.4 1.4 0 0 1 15 5.8v1.6M3.4 12.4h17.2" /></>,
  users: <><circle cx="9" cy="8" r="3.2" /><path d="M3.4 19.6a5.6 5.6 0 0 1 11.2 0M16.4 5.2a3.2 3.2 0 0 1 0 5.6M17.6 19.6a5.6 5.6 0 0 0-1.8-4.1" /></>,
  user: <><circle cx="12" cy="8" r="3.6" /><path d="M5.2 19.8a6.8 6.8 0 0 1 13.6 0" /></>,
  mail: <><rect x="3" y="5.4" width="18" height="13.2" rx="1.6" /><path d="m3.6 6.6 8.4 6 8.4-6" /></>,
  external: <><path d="M14 4.6h5.4V10M19.4 4.6 11 13M17 14v4.4a1.4 1.4 0 0 1-1.4 1.4H5.6a1.4 1.4 0 0 1-1.4-1.4V8.4A1.4 1.4 0 0 1 5.6 7H10" /></>,
  spreadsheet: <><rect x="3.6" y="4.4" width="16.8" height="15.2" rx="1.6" /><path d="M3.6 9.6h16.8M9.4 9.6v10M3.6 14.6h16.8" /></>,
}

export const iconNames = Object.keys(paths)

export default function Icon({ name, size = 16, label, style, ...rest }) {
  const d = paths[name]
  if (!d) return null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      // Decorative by default — the adjacent text already says what this is.
      aria-hidden={label ? undefined : 'true'}
      role={label ? 'img' : undefined}
      aria-label={label}
      style={{ flexShrink: 0, display: 'block', ...style }}
      {...rest}
    >
      {d}
    </svg>
  )
}
