// Study writeups — the learning-in-public evidence engine.
//
// DELIBERATELY OUTSIDE DataContext. Publishing here must not touch defaults.js,
// because bumping CONTENT_VERSION wipes every visitor's localStorage snapshot,
// including your own admin edits. Publishing weekly would mean self-wiping
// weekly. These are git-authored: no version coupling, no admin editor to
// corrupt them, and a verifiable public track record in the commit history.
//
// FIVE RULES that make a later move to file-based markdown a migration rather
// than a rewrite. Do not break them:
//
//   1. `slug` IS the id. URL-safe, permanent, never renamed — at file scale the
//      slug becomes the filename AND the URL. Note this deliberately breaks the
//      b1/e1/p7 id convention used in defaults.js.
//   2. ISO dates ('2026-07-14'), never 'Jul 2026'. Sortable, and a sitemap
//      lastmod needs no parser.
//   3. Body is a markdown string. Migration to <slug>.md is then a 20-line
//      script instead of a rewrite.
//   4. Metadata fields are frontmatter-shaped — this exact set serialises to
//      YAML unchanged. Don't add fields that only make sense in JS.
//   5. Cross-link by slug/id, never by array index or object reference.
//      `relatedCredential` joins to credentials.ladder[].id in defaults.js.
//
// Only `status: 'published'` entries are ever rendered.

export const writeups = [
  {
    slug: 'template-delete-me',
    title: 'Template — replace this with a real writeup',
    date: '2026-08-05',
    updated: null,
    summary:
      'Not published. Copy this entry, give it a real slug, write the body, and flip status to "published".',
    tags: ['template'],
    source: { platform: null, name: null, url: null },
    minutes: 1,
    status: 'draft',
    relatedCredential: 'cr-ccna',
    body: `## What I got wrong first

State the thing you believed before you understood it. This is the part that makes
a writeup worth reading — anyone can restate documentation, but only you can say
what you actually misunderstood.

## What's really going on

Explain the mechanism. Keep it to what you can defend in an interview.

## Why it matters for security

Connect it back. A VLAN misconfiguration is not a config error, it's a trust
boundary failure — that framing is the whole reason these notes belong on a
network security site rather than in a private notebook.

## What I'd still need to check

Being explicit about the edges of your understanding reads as judgment, not
weakness. Leave the open questions in.`,
  },
]

export const publishedWriteups = () =>
  writeups
    .filter((w) => w.status === 'published')
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))

export const writeupBySlug = (slug) =>
  publishedWriteups().find((w) => w.slug === slug) || null
