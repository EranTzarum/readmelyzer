---
name: writing-readmes
description: Use when asked to write, create, rewrite, improve or update a README.md for any repo, skill, library, CLI, app or project — in Claude Code, Codex CLI or Cursor. Also use when a README lacks a summary, visuals, install steps, usage table, FAQ or license, or when someone asks for a "proper", "professional" or "landing-page style" README.
---

# Writing READMEs

A README is a landing page for someone who has never seen the project. It has a fixed shape. Produce that
shape every time; put the project's substance into it. Never invent features, numbers or test counts —
read the repo first and state only what is there.

## Recipe (the output IS this, in this order)

Copy `references/template.md` and fill it. The parts, in order:

1. **Centered header** — `<div align="center">` with an emoji + name, a one-line bold tagline, a second line saying what it does for the reader, and a row of shields.io badges (platform/runtime, license, plus a tests badge when test files exist, otherwise a status or version badge; static badges are fine).
2. **TL;DR** — 3–5 sentences: what you type/run, what happens, what you get. A newcomer can stop here.
3. **Hero visual** — one `<img>` from `docs/assets/*.svg` (or an existing PNG). Never Mermaid alone: some viewers do not render it. Use `assets/flow.svg.tmpl` for a pipeline, `assets/terminal.svg.tmpl` for CLI output.
4. **Why** — the problem, as a table when there are several concrete pains (what went wrong · when found · cost). Real evidence only.
5. **Features** — bulleted, bold lead words, one line each.
6. **Quick start** — a fenced block with numbered install → verify → first command. Then a `<details>` for secondary harnesses/platforms.
7. **Usage** — a command table (command · what happens). Then the second visual: a terminal-style SVG of real output, followed by the exact command.
8. **How it works** — one Mermaid sequence or flow (allowed here because the hero already rendered), then 2–4 numbered ideas that make it different, then a table of stages/modules/commands with what each takes and produces.
9. **What lands in your project** (if the project writes files into another repo) or **API** (if it is a library) — a fenced tree or signature list with a comment per line. Neither applies → drop the section.
10. **Repository map** — fenced tree of the repo itself.
11. **Verify** — the command that passes in the checked-in state today and what it proves. If the project's real gate cannot run yet (no manifest, no tests), say so in one line and give the nearest runnable check.
12. **Extend** — three bullets: add X, add Y, add Z, each naming the file to touch.
13. **FAQ** — 5–7 bold questions with one-line answers, including "does it overwrite?", "does it touch secrets?", "what if I already have…".
14. **License** — link to the LICENSE file. Add MIT if none exists and the owner has not said otherwise.

Sections with nothing true to say are dropped, never padded. Everything else is REQUIRED.

## Rules

- **Read before writing.** Scan the tree, package/manifest, tests, existing docs. Every claim traces to a file.
- **Updating an existing README:** keep every true fact and link, restructure into the recipe, delete stale claims, and say in the commit message what changed. Do not append a new README under the old one.
- **Visuals live in `docs/assets/`** as SVG you write by hand from the templates (no rendering tools needed). Validate with `node <skill>/scripts/check-readme.mjs <repo>`; it also checks every referenced image exists.
- **Tables for parallel facts, prose for argument.** No paragraph longer than four lines.
- **No filler**: no "welcome", no "in this document", no restating the repo name in every heading.
- **Run the checker before finishing.** Fix every line it prints. It is the definition of done.

## Checker

```bash
node ~/.claude/skills/writing-readmes/scripts/check-readme.mjs <repo-root>
```

Exit 1 with one line per missing part. Example: `MISSING: hero image under docs/assets referenced in the first 40 lines`.

## Common mistakes

| Mistake | Fix |
|---|---|
| Mermaid as the only diagram | add an SVG hero from the template; keep Mermaid as the second visual |
| "Features" copied from the tagline | each bullet names a concrete mechanism (file, flag, command) |
| Install block without a verify step | add the test/health command and its expected output |
| Numbers you did not measure ("99 % faster") | delete, or cite the file/test that proves it |
| FAQ that answers nothing a newcomer asks | overwrite / secrets / existing project / platform questions first |
