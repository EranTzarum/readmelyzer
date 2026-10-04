---
name: readmelyzer
description: Use when asked to write, create, rewrite, improve, redesign or update a README.md for any repo, skill, library, CLI, app or project — in Claude Code, Codex CLI or Cursor — or when the user says "readmelyzer". Also use when a README lacks a logo, summary, visuals, install steps, usage table, FAQ or license, or when someone asks for a "proper", "professional", "beautiful" or "landing-page style" README.
---

# readmelyzer

A README is a landing page for someone who has never seen the project and has two minutes.
It should be **clear first, enjoyable second**: a logo that gives it a face, a hook that says why
they should care, and short sections they can skim. readmelyzer reads the repo, then fills one
fixed shape with what is actually there. Never invent features, numbers or test counts.

## Recipe (the output IS this, in this order)

Copy `references/template.md` and fill it.

1. **Logo + header.** Draw `docs/assets/logo.svg` from `assets/logo.svg.tmpl` (pick a palette,
   a 1-2 letter monogram, one motif that says what the project does). Then, centered: the logo at
   `width="112"`, `# name`, a **bold hook** (the benefit, not the category), one plain line saying
   what the reader gets, and 3-5 shields.io badges (runtime, license, tests if tests exist).
2. **TL;DR.** One "at a glance" table with three cells: *You do* · *It does* · *You get*. Then at
   most two sentences. A newcomer can stop here.
3. **Hero visual.** One `<img>` from `docs/assets/*.svg` (`assets/flow.svg.tmpl` for a pipeline).
   Never Mermaid alone; some viewers do not render it.
4. **Why.** Tell it as a before/after: a table of real pains (what went wrong · where · cost), then
   one line on how this project answers them. Real evidence only.
5. **Features.** 4-7 bullets, each `emoji **Lead words.** one line naming the mechanism`.
6. **Quick start.** A numbered fenced block: install → verify (with expected output) → first run.
   Add one `> [!TIP]` with the shortcut people miss. Other platforms go in a `<details>`.
7. **Usage.** A table (command · what happens), then a terminal-style SVG of real output
   (`assets/terminal.svg.tmpl`) and the exact command that produced it.
8. **How it works.** One Mermaid diagram, then 2-4 numbered ideas that make it different, then a
   table of parts (part · takes · produces).
9. **What lands in your project** (it writes into other repos) or **API** (it is a library).
   Neither → drop it.
10. **Repository map.** A fenced tree, one comment per line, inside `<details>`.
11. **Verify.** The command that passes today and what it proves. No real gate yet → say so in one
    line and give the nearest runnable check.
12. **Extend.** Three bullets: add X, add Y, add Z, each naming the file to touch.
13. **FAQ.** 5-7 questions, each a `<details><summary><b>Question?</b></summary>` with a one-line
    answer. Lead with the ones newcomers fear: does it overwrite, does it touch secrets, what if I
    already have…, which platforms.
14. **License.** Link the LICENSE file (add MIT if none exists and the owner has not said
    otherwise), then a one-line centered footer.

Sections with nothing true to say are dropped, never padded.

## Voice

| Do | Don't |
|---|---|
| "You type `/prompter`. Claude shows a brief, then works." | "This tool provides functionality for prompt optimization." |
| Second person, active verbs, short sentences | Passive voice, "utilize", "leverage", "robust" |
| Explain a term the first time it appears | Assume the reader knows your internal names |
| One emoji per section heading, one per feature | Emoji in every sentence |
| Paragraphs of at most 3 lines; tables for parallel facts | Walls of prose, or tables for an argument |
| A `> [!TIP]`, `> [!NOTE]` or `> [!WARNING]` where it saves the reader a mistake | Callouts for decoration |

No filler: no "welcome", no "in this document", no restating the name in every heading.

## Rules

- **Read before writing.** Scan the tree, manifest, tests and existing docs. Every claim traces to a file.
- **Updating an existing README:** keep every true fact and link, move it into the recipe, delete
  stale claims, keep an existing logo unless asked to redraw it, and say in the commit message what changed.
- **Visuals live in `docs/assets/`** as SVG written by hand from the templates (no rendering tools).
- **One workspace, distinct logos:** when several repos sit side by side, give each its own palette.
- **Run the checker before finishing.** Fix every line it prints. It is the definition of done.

## Checker

```bash
node ~/.claude/skills/readmelyzer/scripts/check-readme.mjs <repo-root>
```

Exit 1 with one `MISSING:` line per gap, for example `MISSING: logo: docs/assets/logo.svg shown in
the header`. It checks structure only, never whether the writing is good; the Voice table is yours.

## Common mistakes

| Mistake | Fix |
|---|---|
| Hook names the category ("A CLI tool for…") | Name the benefit ("Ship a README people actually read") |
| Mermaid as the only diagram | Add an SVG hero; keep Mermaid for How it works |
| Features copied from the tagline | Each bullet names a mechanism: a file, flag or command |
| Install block without a verify step | Add the test or health command and its expected output |
| Numbers nobody measured ("99 % faster") | Delete, or cite the file or test that proves it |
| Same logo colors for every repo | Pick a different palette row per project |
