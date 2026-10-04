# readmelyzer

Agent skill that studies a repo and designs a README tailored to it (design brief,
archetype layout, pictogram logo, palette, voice), with a public mode that anonymizes.
User-facing docs: `README.md`. Agent instructions: `SKILL.md`.

## Layout

- `SKILL.md`: the workflow (study → brief → layout → design → write → check).
- `references/`: `archetypes.md`, `logo-guide.md`, `privacy.md`, `template.md` (section modules).
- `assets/*.svg.tmpl`: logo frame, flow hero, terminal output, with palette tokens.
- `scripts/check-readme.mjs`: structure + privacy checker (Node, no dependencies); `check-readme.test.mjs`: its tests.

## Rules

- Change a recipe rule in three places together: `SKILL.md`, the matching `references/` file, and the checker + a test.
- The checker judges structure and privacy only, never taste; keep it that way.
- Files that must contain fake leaks carry the marker `readmelyzer:allow-examples`.
- **This repo is public.** No personal paths, usernames, private project or
  client names, real prompts or logs in any tracked file. Examples and fixtures
  use invented details with the same problem shape. Before every push:
  `node ~/.claude/skills/readmelyzer/scripts/check-readme.mjs . --public --all-files`
  must print no `LEAK:` line.

## Gate

```bash
node --test scripts/check-readme.test.mjs
node scripts/check-readme.mjs . --public --all-files
```

Copies of this skill live in `~/.codex/skills/readmelyzer` and `~/.cursor/skills/readmelyzer`
(Windows and WSL). Re-sync them after every change.
