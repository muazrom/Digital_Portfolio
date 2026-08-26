// Study writeups — the learning-in-public evidence engine.
//
// DELIBERATELY OUTSIDE DataContext. Publishing must not touch defaults.js,
// because bumping CONTENT_VERSION wipes every visitor's localStorage snapshot,
// including your own admin edits. Publishing weekly would mean self-wiping
// weekly. These are git-authored: no version coupling, no admin editor to
// corrupt them, and a verifiable public track record in the commit history.
//
// ONE FILE PER WRITE-UP, in content/writeups/<slug>.md — frontmatter on top,
// prose underneath. vite/content.js reads the frontmatter at build time and
// hands it over as `virtual:content`, so there is no second list to keep in
// sync with the folder. See content/writeups/README.md for the fields.
//
//   `slug` IS the id — it's the filename, the URL, and the cross-link target,
//   so renaming a file breaks a published URL. This deliberately breaks the
//   b1/e1/p7 convention used in defaults.js.
//   Dates are ISO so they sort and a sitemap lastmod needs no parser.
//   Cross-links use ids (`credential:` -> a file in content/credentials),
//   never array positions.

import { writeups as generated } from 'virtual:content'
import { stripFrontmatter } from '../../../vite/frontmatter.js'

export const writeups = generated

// Vite code-splits each body into its own chunk, fetched only when a reader
// opens that writeup — the index and homepage never download prose they don't
// show. The metadata above is already in the bundle; this is the prose only.
const bodies = import.meta.glob('/content/writeups/*.md', { query: '?raw', import: 'default' })

export function loadBody(slug) {
  const loader = bodies[`/content/writeups/${slug}.md`]
  // The raw file still carries its frontmatter; the renderer wants prose only.
  return loader ? loader().then(stripFrontmatter) : Promise.resolve(null)
}

export const publishedWriteups = () =>
  writeups
    .filter((w) => w.status === 'published')
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))

export const writeupBySlug = (slug) =>
  publishedWriteups().find((w) => w.slug === slug) || null
