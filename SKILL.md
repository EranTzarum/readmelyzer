---
name: readmelyzer
description: Use when asked to write, create, rewrite, improve, redesign or update a README.md for any repo, skill, library, CLI, app or project — in Claude Code, Codex CLI or Cursor — or when the user says "readmelyzer". Studies the project first, then designs a README tailored to it - its own pictogram logo, palette, voice, layout and examples - and can write it in public mode (personal paths, private project names and real prompts anonymized) for sharing. Also use when a README looks generic, lacks a logo, visuals, install steps or examples, or must be safe to share publicly.
---

# readmelyzer

A README is the project's front door. A generic one says "nobody cared". readmelyzer studies the
project first, writes a short **design brief**, and only then builds a README whose logo, colors,
voice, layout and examples all come from that brief, so two different projects never look alike.
Facts come from the repo; nothing is invented.

## Workflow

### 1. Study the project (read-only)

Read the tree, manifest, entry points, tests, existing docs, and any brand assets (an existing
logo, colors in CSS/theme files, an icon). Answer for yourself: what it does in one sentence, who
uses it, how they start, what they see when it works.

### 2. Write the design brief (show it to the user, 6 lines, then continue)

```text
Archetype:   agent skill | CLI | library | app/product | template/starter | workspace/monorepo | research/docs
Audience:    who reads this and what they already know
Personality: 2-3 adjectives (e.g. calm + precise, playful + fast, rigorous + safe)
Metaphor:    the one image that captures what it does (e.g. "a magnifier over a page")
Palette:     2-3 hex colors that fit the personality (reuse existing brand colors if the repo has them)
Visibility:  public (anonymize, see Privacy) | private (specifics allowed)
```

Ask only if visibility is unclear and the repo holds personal material; otherwise default to **public**.

### 3. Engagement first, reference second (the budget)

A README sells first and documents second. Research behind this: `docs/research-readme-patterns.md`.
Everything above the first `## ` section is the **pitch**, and it must fit one screen (40 lines):

1. logo, `# name`, one bold hook that names the benefit, a row of 4-6 **`for-the-badge` badges with logos in brand colors** (tools it works with, runtime, tests, license);
2. a **demo** in the first 40 lines: a terminal recording, a screenshot, or a terminal SVG of real output (`references/demo-guide.md`). A flow diagram is not a demo;
3. **before / after** in two short blocks (what you did by hand, what you do now);
4. **three benefit cards**: an SVG card image with icon, color and 3-4 short lines each (a one-row table is the fallback), and optionally a strip of **stat tiles** with 3-4 true numbers from the repo (tests, rounds, minutes, runs). At most 1 table before the first example;
5. a **30-second install** (2-3 commands + a verify line), then **one copy-paste example with its real output**, within the first 100 lines.

Everything else is reference. Move it to `docs/<topic>.md` and leave one link, or fold short items in a
`<details><summary>`: flag and option tables, severity or rule lists, engines/platform matrices, config
reference, internals and "how it works", the repository map, long FAQs. If the user needs a long install
by hand (several steps people follow in order), keep those steps in the README below the example; fold
only the platform variants. Cap: 160 lines, and any README over 100 lines links into `docs/`.

### 4. Pick the layout from the archetype

`references/archetypes.md` gives each archetype its section set, order, hero type and example
style. Use it as the skeleton; drop any section with nothing true to say, and add one that the
project clearly needs (e.g. "Screenshots" for an app, "API" for a library). Do not force every
README into the same order.

### 5. Design the visuals as one system

**Visual kit (default, no external services):** write one `docs/assets/visuals.json` and run
`node ~/.claude/skills/readmelyzer/scripts/make-visuals.mjs docs/assets/visuals.json`. It writes `demo.svg` (animated terminal, loops, honors reduced motion), `cards.svg` and `stats.svg`. Every number and line comes from the repo, never invented. Details: `references/visual-kit.md`.

- **Logo:** draw a custom pictogram of the metaphor, following `references/logo-guide.md`
  (`assets/logo.svg.tmpl` is only the frame). No monogram-in-a-square defaults; two projects never
  share a pictogram or palette.
- **Hero and diagrams:** fill `assets/flow.svg.tmpl` / `assets/terminal.svg.tmpl` with the brief's
  palette (`{{ACCENT}}`, `{{ACCENT_SOFT}}`, `{{INK}}`) so logo, hero and diagrams match.
- **Badges:** 3-5, in the palette where shields.io allows (`?color=hex`).

### 6. Write in the brief's voice

| Personality | Sounds like |
|---|---|
| calm + precise | "Run one command. It checks six things and tells you which one is missing." |
| playful + fast | "Point it at a repo. Grab a coffee. Come back to a README you'd star." |
| rigorous + safe | "Nothing is written until you approve the plan. Every rule cites the incident that created it." |

Always: second person, active verbs, short sentences, terms explained the first time,
paragraphs of 3 lines or fewer, tables for parallel facts. No filler ("welcome", "in this document").

### 7. Examples: real shape, anonymized details

Every README needs at least one concrete example (input → output). Build it from the real
behaviour, then apply **Privacy** if public: keep the shape and the lesson, replace the specifics.

### 8. Check

```bash
node ~/.claude/skills/readmelyzer/scripts/check-readme.mjs <repo-root> [--public]
```

Fix every `MISSING:`, `BUDGET:` and `LEAK:` line. `--no-budget` skips the length and demo checks for a repo not yet migrated; say so when you use it. The checker covers structure and privacy, never taste: the
brief is how you judge taste.

## Privacy (public mode)

Readers on LinkedIn or GitHub should learn how to use the project, not the author's private work.
`references/privacy.md` has the full rules. In short:

- **Remove:** absolute user paths, usernames, emails, private repo and client/project names, real
  prompts and logs, exact personal dates, account ids, internal URLs.
- **Generalize:** "the CRM build in July" → "a multi-tenant web app"; a real prompt → a short
  invented prompt with the same problem shape; real numbers → keep only if they are about the
  project itself (test counts), not about the author's life.
- **Private terms:** `~/.readmelyzer/private-terms.txt` (one term per line) is read by `--public`.
  It lives in the home folder, never in a repo. Create it on first use if the user names terms.
- **Beyond the README:** in a repo meant to be public, scan fixtures, docs and examples too, and
  tell the user that git history still holds old text.

## Rules

- **Study before writing.** Every claim traces to a file.
- **Updating a README:** keep every true fact and link, re-run the brief, keep an existing logo
  that already fits the brief, and say in the commit message what changed.
- **Visuals live in `docs/assets/`**. Default demo: a hand-written terminal SVG, no tools needed. A real recording (vhs, asciinema) or an AI-generated hero image is an upgrade, see `references/demo-guide.md`.
- **One workspace, distinct identities:** check sibling repos' logos and palettes before choosing.
- **Run the checker before finishing.** Its output is the definition of done for structure and privacy.

## Common mistakes

| Mistake | Fix |
|---|---|
| Same layout for a CLI and an app | Pick the archetype first; let it decide the sections |
| Logo is a letter in a gradient square | Draw the metaphor (references/logo-guide.md) |
| Hero colors unrelated to the logo | Use the brief's palette tokens in every SVG |
| Hook names the category ("A CLI tool for…") | Name the benefit ("Ship a README people actually read") |
| Example copied from the author's real work | Keep the shape, invent neutral specifics |
| Install block without a verify step | Add the test or health command and its expected output |
| Opens well, then 8 tables and flag lists | Apply the budget: pitch in one screen, reference to `docs/` |
| Only a flow diagram, no demo | Add a terminal SVG of real output in the first 40 lines |
| Benefits written as a paragraph | Three cards: bold lead word + one line each |
