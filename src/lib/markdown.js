// Deliberately tiny markdown renderer — headings, code, lists, quotes, tables of
// nothing fancy. A writeup needs these and no more, and this avoids a dependency
// plus the sanitizer an HTML-string approach would force on us forever.
//
// Bodies are authored by us in-repo, never user input, so the only escaping here
// is to keep stray angle brackets in code samples from breaking the render.

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Inline: `code`, **bold**, *italic*, [text](url). Code is handled first and its
// contents are held aside so ** inside a code span isn't treated as bold.
// The code placeholder uses NUL, which cannot appear in the source. A bare number
// would make the restore pass wrap real prose digits ("in 5 minutes") in <code>.
function inline(src) {
  const codes = []
  let s = escapeHtml(src).replace(/`([^`]+)`/g, (_, c) => {
    codes.push(c)
    return '\u0000' + (codes.length - 1) + '\u0000'
  })

  s = s
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => '<code>' + codes[Number(i)] + '</code>')
}

export function renderMarkdown(md) {
  if (!md) return ''
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const out = []
  let i = 0

  const flushList = (tag, items) =>
    out.push(`<${tag}>${items.map((t) => `<li>${inline(t)}</li>`).join('')}</${tag}>`)

  while (i < lines.length) {
    const line = lines[i]

    // fenced code block
    if (/^```/.test(line)) {
      const lang = line.slice(3).trim()
      const buf = []
      i++
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++])
      i++ // closing fence
      out.push(
        `<pre data-lang="${escapeHtml(lang)}"><code>${escapeHtml(buf.join('\n'))}</code></pre>`
      )
      continue
    }

    // heading
    const h = line.match(/^(#{1,4})\s+(.*)$/)
    if (h) {
      // Clamp to h2+: the page title is the h1, and '##' is the conventional
      // top-level heading inside a body, so it must not land on h3 and leave
      // the document with an h1 -> h3 jump.
      const level = Math.max(2, h[1].length)
      out.push(`<h${level}>${inline(h[2])}</h${level}>`)
      i++
      continue
    }

    // blockquote
    if (/^>\s?/.test(line)) {
      const buf = []
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ''))
      out.push(`<blockquote>${inline(buf.join(' '))}</blockquote>`)
      continue
    }

    // unordered list
    if (/^\s*[-*]\s+/.test(line)) {
      const items = []
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i++].replace(/^\s*[-*]\s+/, ''))
      }
      flushList('ul', items)
      continue
    }

    // ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items = []
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i++].replace(/^\s*\d+\.\s+/, ''))
      }
      flushList('ol', items)
      continue
    }

    // table — header row, a |---|---| separator, then body rows. The lab writeups
    // lean on these for ipconfig output and tracert hops, so they're not optional.
    if (/^\s*\|.*\|\s*$/.test(line) && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1] || '')) {
      const cells = (row) =>
        row.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
      const head = cells(lines[i])
      i += 2 // header + separator
      const body = []
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) body.push(cells(lines[i++]))
      out.push(
        '<div class="table-scroll"><table>' +
          `<thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>` +
          `<tbody>${body
            .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`)
            .join('')}</tbody>` +
          '</table></div>'
      )
      continue
    }

    // horizontal rule
    if (/^\s*---+\s*$/.test(line)) {
      out.push('<hr />')
      i++
      continue
    }

    // blank
    if (!line.trim()) {
      i++
      continue
    }

    // paragraph — consume until a blank line or a block-level opener
    const buf = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,4}\s|```|>\s?|\s*[-*]\s|\s*\d+\.\s|\s*\|.*\|\s*$|\s*---+\s*$)/.test(lines[i])
    ) {
      buf.push(lines[i++])
    }
    out.push(`<p>${inline(buf.join(' '))}</p>`)
  }

  return out.join('\n')
}
