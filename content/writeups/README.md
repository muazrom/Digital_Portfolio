# Write-ups

One file per write-up: `content/writeups/<slug>.md`

**The filename is the URL.** `use-cdp-to-map-a-network.md` is served at
`#/writeups/use-cdp-to-map-a-network`, and it's what `credential:` cross-links
point at. Renaming a file breaks a published link — pick the slug once.

## Template

```md
---
title: The thing you actually worked out, not the lab's name
date: 2026-08-19
summary: >
  One or two sentences. The folded > lets it wrap across lines
  without becoming a multi-line string.
tags: [cdp, ssh, layer-2]
platform: Cisco NetAcad
course: Network Support and Security — Packet Tracer
---

## Objective

Prose starts here.
```

## Fields

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Shown in the log and as the page heading |
| `date` | yes | `YYYY-MM-DD`. Sorts the log, newest first |
| `summary` | yes | One line in the log, full text in the archive |
| `tags` | no | `[a, b, c]` |
| `platform` | no | Grouped in the log's SOURCE column |
| `course` | no | Drives the Overview's by-course breakdown; text before ` — ` is the course |
| `minutes` | no | **Computed from word count if omitted** — leave it out |
| `status` | no | Defaults to `published`. Set `draft` to keep it off the site |
| `updated` | no | ISO date |
| `credential` | no | Filename (no `.md`) of a credential in `../credentials/` |

## Notes

- Titles carry the insight, not the lab name: *"RSA keys won't generate until
  the router has a domain name"* beats *"Configure SSH"*.
- Nothing here goes through the admin panel, by design. These are git-authored,
  so the commit history is itself the evidence that the dates are real.
