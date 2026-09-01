# Tracks

One file per track: `content/tracks/<id>.md`. A track is a *series* of
credentials leading to one capstone — the Network Technician Career Path, or
CCNA's three-course run at the certification.

Each track renders as its own rack in the Credentials section. Everything not
claimed by a track falls into a final "Standalone" rack automatically.

## Template

```md
---
name: CCNA
issuer: Cisco
capstone: CCNA 200-301
capstone_kind: certification
steps:
  - ITN — Introduction to Networks | cr-cisco-ccna-itn
  - SRWE — Switching, Routing and Wireless Essentials | cr-cisco-ccna-srwe
  - ENSA — Enterprise Networking, Security and Automation | cr-cisco-ccna-ensa
---
```

There is no body. The frontmatter is the whole file.

## Fields

| Field | Required | Notes |
|---|---|---|
| `name` | yes | The rack title |
| `issuer` | yes | |
| `capstone` | yes | A credential id if the capstone is **earned**; otherwise the plain display name of what the track leads to |
| `capstone_kind` | only if pending | The kind badge to show for an unearned capstone — `certification` for CCNA |
| `exam` | no | `true` adds "+ exam" to a complete track's meta line |
| `steps` | yes | The series, in order. One `- ` line each |

## Step syntax

```
Label | credential-id
```

The id is optional, and **resolved lazily**. Write it for a course you haven't
taken yet and the step sits there as a pending slot until that badge file
appears in `../credentials/` — at which point it flips to earned on its own.
Nothing has to be edited to publish a step.

When the id resolves, the credential's own `name` is displayed instead of the
label, so a rack row can never disagree with the badge it points at.

## The two rules

**A step is earned if and only if its credential id resolves.** Nothing in here
asserts "earned" by hand, so this file and the credentials folder cannot drift
apart. That's also why a pending step is never a file in `../credentials/` —
that folder stays earned-only, and pending steps are not credentials, so they
count toward nothing: not the badge total, not "N verifiable", not Stage 1.

**A track is hidden until at least one step is earned.** A track with nothing
held is a plan, not evidence, and belongs on the Stage 1 readiness card instead.
So `ccna.md` ships today and renders nothing — it turns itself on the day the
first CCNA badge lands.

## Naming a step's id before it exists

This is the intended use, not a workaround. Committing the full shape of a track
up front is what lets the rack show "1 of 3" honestly, and what makes publishing
the next badge a one-file drop.

An unresolved id is therefore normal, not an error, and the build doesn't treat
it as one. It prints a single line per track naming what's still outstanding:

```
[content] ccna.md: 0/3 steps earned — pending cr-cisco-ccna-itn, cr-cisco-ccna-srwe, cr-cisco-ccna-ensa
```

That's where a misspelled id shows up — if a step you *have* earned is still
listed as pending there, the id in this file doesn't match the filename in
`../credentials/`.
