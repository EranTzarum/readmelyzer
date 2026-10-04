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

### 3. Pick the layout from the archetype

`references/archetypes.md` gives each archetype its section set, order, hero type and example
style. Use it as the skeleton; drop any section with nothing true to say, and add one that the
project clearly needs (e.g. "Screenshots" for an app, "API" for a library). Do not force every
README into the same order.

### 4. Design the visuals as one system

- **Logo:** draw a custom pictogram of the metaphor, following `references/logo-guide.md`
  (`assets/logo.svg.tmpl` is only the frame). No monogram-in-a-square defaults; two projects never
  share a pictogram or palette.
- **Hero and diagrams:** fill `assets/flow.svg.tmpl` / `assets/terminal.svg.tmpl` with the brief's
  palette (`{{ACCENT}}`, `{{ACCENT_SOFT}}`, `{{INK}}`) so logo, hero and diagrams match.
- **Badges:** 3-5, in the palette where shields.io allows (`?color=hex`).

### 5. Write in the brief's voice

| Personality | Sounds like |
|---|---|
| calm + precise | "Run one command. It checks six things and tells you which one is missing." |
| playful + fast | "Point it at a repo. Grab a coffee. Come back to a README you'd star." |
| rigorous + safe | "Nothing is written until you approve the plan. Every rule cites the incident that created it." |

Always: second person, active verbs, short sentences, terms explained the first time,
paragraphs of 3 lines or fewer, tables for parallel facts. No filler ("welcome", "in this document").

### 6. Examples: real shape, anonymized details

Every README needs at least one concrete example (input → output). Build it from the real
behaviour, then apply **Privacy** if public: keep the shape and the lesson, replace the specifics.

### 7. Check

```bash
node ~/.claude/skills/readmelyzer/scripts/check-readme.mjs <repo-root> [--public]
```

Fix every `MISSING:` / `LEAK:` line. The checker covers structure and privacy, never taste: the
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
- **Visuals live in `docs/assets/`** as hand-written SVG; no rendering tools needed.
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
