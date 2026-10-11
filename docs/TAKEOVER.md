# readmelyzer: takeover

For the session that continues readmelyzer. Read this first, then `AGENTS.md` and `SKILL.md`, then
the `references/` file for whatever you change.

## Where this session lives

The session's working folder is the **umbrella** (`AI Development OS/`), so it is listed with the
manager in the app sidebar. It works **only inside `readmelyzer/`**: edits, commits and pushes
happen in this repo. The umbrella files (`AGENTS.md`, `README.md`, `docs/`) belong to the manager
session.

## State (2026-10-11)

- **Repo:** public, `main` only. Installed for Claude Code through a junction in
  `~/.claude/skills/readmelyzer`. Codex and Cursor get **copies** (Windows and WSL) in
  `~/.codex/skills/readmelyzer` and `~/.cursor/skills/readmelyzer`.
- **What it does:**
  1. Studies a repo.
  2. Writes a 6-line design brief: archetype, audience, personality, metaphor, palette, visibility.
  3. Picks a layout per archetype (`references/archetypes.md`, 7 archetypes).
  4. Draws a custom pictogram logo (`references/logo-guide.md`).
  5. Writes in the brief's voice.
  6. Checks with `scripts/check-readme.mjs`.
- **The checker:**
  - Covers structure only: logo, hook, badges, hero, get-started with a verify step, example, license.
  - Its `--public --all-files` mode scans every tracked file for user paths, emails and private terms
    from `~/.readmelyzer/private-terms.txt` (outside every repo).
  - Files with deliberate fake leaks carry `readmelyzer:allow-examples`.
- **Used for** the READMEs of every skill in the umbrella and of the umbrella itself. The public
  check is the gate before every push to a public repo there.
- **Engagement budget (new, local commit, not pushed):** pitch in 40 lines, a demo in the first 40, one table before
  the first example, example by line 100, README under 160 lines and linked into `docs/`. Rules in `SKILL.md` step 3 and
  `references/archetypes.md`; demo options in `references/demo-guide.md` (default: hand-written terminal SVG; vhs/asciinema
  and AI-generated hero images are optional upgrades). Checker prints `BUDGET:`; `--no-budget` skips. Research:
  `docs/research-readme-patterns.md`. Proofs: pr-gate's README (241 → 133 lines) and readmelyzer's own (209 → 109 lines), both from `docs/assets/visuals.json`.
- **No open issues.**

## Open items, best first

0. **Migrate the READMEs that still fail the budget**: project-kickoff, prompter, pre-compact, ready, and the umbrella
   (readmelyzer and pr-gate are done). Until each is migrated, its push gate needs `--no-budget` (the umbrella
   `AGENTS.md` rule is the manager's to change). Method: write `docs/assets/visuals.json`, run `scripts/make-visuals.mjs`,
   move internals to `docs/`, keep every true fact.

1. **Private-term coverage depends on the terms file.**
   - When pr-gate went public, the term list missed names used only in prose (an orchestrator's
     internal name, a person's first name), so a manual grep was needed.
   - Ideas: a `--suggest-terms` mode that lists capitalised names and repo-like slugs found in
     `docs/` for the user to confirm; or check the remotes of sibling repos as private terms
     automatically.
2. **Duplicate logo check.** "Not identical to a sibling repo's logo" is a byte comparison. Two
   near-identical pictograms with different whitespace pass. A normalized comparison (shapes only)
   would catch them.
3. **Taste is judged only against the brief.** Consider a short rubric in `SKILL.md` for the final
   self-review: one hook, one example, nothing generic.
4. **Codex/Cursor hosts** use the copies; not re-tested since 2026-10-04.

## Gate

```bash
node --test scripts/check-readme.test.mjs scripts/make-visuals.test.mjs
node scripts/check-readme.mjs . --public --all-files
```

## Releasing a change

1. Change a recipe rule in three places together: `SKILL.md`, the matching `references/` file, and
   the checker with a test.
2. Run the gate.
3. Commit and push `main`.
4. Re-sync the copies:
   - **Windows:** `robocopy <repo> %USERPROFILE%\.codex\skills\readmelyzer /MIR /XD .git`, and the
     same for `.cursor`.
   - **WSL:** `rsync -a --delete --exclude .git <repo>/ ~/.codex/skills/readmelyzer/`, and the same
     for `.cursor`.
5. Other repos run this checker through the junction. Changing what it flags can turn their pushes
   red, so tell the manager session.

## Boundaries

- **Public repo:** no personal paths, private names, real prompts or logs.
- **Old commits** hold pre-anonymization text (no secrets; checked 2026-10-04). Accepted.
