# Credentials

One file per credential: `content/credentials/<id>.md`, with its badge image
sitting in this folder beside it.

**The filename is the id.** Write-ups cross-link to it via `credential:`, so
renaming a file breaks those links.

## Adding one

1. Drop the badge image in this folder (`cisco-networking-basics.png`).
2. Drop a `.md` beside it naming that file.

That's it — no `defaults.js` edit, no version bump. The rack, the counts in the
Overview, the nav badge, and the panel header all follow automatically.

## Template

```md
---
name: Networking Basics
issuer: Cisco Networking Academy
kind: course
topic: network
date: 2026-08
image: cisco-networking-basics.png
credential: https://www.credly.com/badges/.../public_url
---
```

## Fields

| Field | Required | Notes |
|---|---|---|
| `name` | yes | As the issuer writes it |
| `issuer` | yes | |
| `kind` | yes | `certification` \| `path` \| `course` \| `module` |
| `date` | yes | `YYYY-MM` or `YYYY`. Only the year is displayed |
| `topic` | no | `network` \| `security` \| … |
| `image` | no | Filename in this folder, or a full URL |
| `credential` | no | Public verification URL, **or** a filename in this folder (e.g. a PDF) |

## Two things worth knowing

`kind: certification` is reserved for **exam-based certs**. It renders in accent
blue, visibly ranked above course badges. When CCNA lands, that's the one that
gets it — don't spend it on a completion badge.

`credential` is what lights the verification LED on the rack, and the Overview
reports "N verifiable" from it. It means *someone else can check this*, so a
public URL or a real certificate file counts and nothing else does.

## Earned only

Anything not actually held belongs in the hero bio as prose, or as a target on
the Stage 1 readiness card — never as a file in here.

A **track** (`../tracks/`) is the one thing allowed to name a credential that
doesn't exist yet, so it can show a series you're partway through. Those steps
render explicitly as pending slots and are not credentials: they count toward
nothing — not the badge total, not "N verifiable", not Stage 1. The step turns
into a real unit on its own the day you drop the badge file in here, which is
why it stays a one-file drop.
