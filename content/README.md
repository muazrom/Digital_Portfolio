# content/

Drop files here. Nothing else to update.

`vite/content.js` reads these folders at build time and hands the site a
`virtual:content` module, so there is no second list anywhere to keep in sync
with what's on disk. Add a file, refresh, it's on the site.

| Folder | One file per | Appears in |
|---|---|---|
| `writeups/` | study write-up | Field Notes panel + `#/writeups` archive |
| `credentials/` | badge or certificate | A rack in the Credentials panel |
| `tracks/` | series of credentials | Groups those racks — one rack per track |

All three use the same shape: a `---` frontmatter block on top, content
underneath. See the README inside each folder for its fields.

## Why it's built this way

The prose in `writeups/` is **not** bundled into the main JavaScript — each body
is code-split and fetched only when someone opens that write-up, so the homepage
never downloads eighteen articles it doesn't show. Only the frontmatter travels
with the page.

Credential images are imported through Vite, so they get content-hashed
filenames and long-cache headers for free. That's why the image lives in the
folder next to its `.md` rather than in `assets/`.
