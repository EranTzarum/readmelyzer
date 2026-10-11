# What high-star READMEs do (research, 2026-10-11)

Question: why do trending skill and tool READMEs make people install, and what does
readmelyzer's output do differently? Eleven READMEs read from `main` through raw GitHub
(structure and line counts are estimates, from the source Markdown).

## The eleven

| README | Stars note | Length | Hero visual | Install | `<details>` |
|---|---|---|---|---|---|
| [anthropics/claude-code](https://github.com/anthropics/claude-code) | flagship agent CLI | ~74 lines | `demo.gif` before install | 5 one-line methods, ~33 lines | none |
| [forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills) | reported ~90k-190k (sources disagree) | ~190 lines | none: a quote, then a 4-row problem→fix table | 2 options (plugin, or one `curl`), ~30 lines | none |
| [obra/superpowers](https://github.com/obra/superpowers) | ~41k (Jan 2026 roundup) | ~335 lines | none | 16 harnesses, half the file | none |
| [anthropics/skills](https://github.com/anthropics/skills) | official skills repo | ~98 lines | none | marketplace add + 4-step menu | none |
| [Aider-AI/aider](https://github.com/Aider-AI/aider) | agent CLI | ~190 lines | animated SVG screencast under the tagline | 1 code block, 3 lines | none |
| [charmbracelet/vhs](https://github.com/charmbracelet/vhs) | terminal GIF tool | ~850 lines | hero GIF under the tagline | 70 lines, distro steps folded | 2 |
| [charmbracelet/gum](https://github.com/charmbracelet/gum) | shell UI tool | ~500 lines | hero GIF, then one GIF per command | 80 lines, 3 distro blocks folded | 3 |
| [astral-sh/uv](https://github.com/astral-sh/uv) | Python tooling | ~340 lines | benchmark chart under the tagline | 2 one-liners, then link to docs | none |
| [sharkdp/bat](https://github.com/sharkdp/bat) | `cat` clone | ~1100 lines | 3 screenshots right under the header | 250 lines, per OS | none |
| [junegunn/fzf](https://github.com/junegunn/fzf) | fuzzy finder | ~1300 lines | one screenshot at line ~35 | 170 lines | 1, no label |
| [jesseduffield/lazygit](https://github.com/jesseduffield/lazygit) | git TUI | ~630 lines | screenshot, then one short video per feature | 230 lines, ~35 methods | none |

Star counts are third-party snapshots from different dates; check GitHub before quoting one.

## Patterns that repeat

1. **One sentence says what it is, and it names the outcome.** "An extremely fast Python package manager", "A cat clone with syntax highlighting". Never "A tool for...". The sentence sits within the first 3 lines.
2. **A visual proof sits within the first screen** in 8 of 11: a GIF (claude-code, vhs, gum), an animated SVG (aider), a chart (uv), screenshots (bat, fzf, lazygit). The three skill repos with no visual (superpowers, anthropics/skills, karpathy) replace it, at best, with a strong text hook: a quote and a problem→fix table.
3. **The hero is one image or one table, not both.** None stacks a logo, badges, a diagram and a table before the install.
4. **Install is short or folded.** The large READMEs (vhs, gum) keep 5-6 package managers visible and fold the rest into `<details>`. The small ones (claude-code, aider, karpathy, uv) show 1-2 commands and link out. The ones that print every platform openly (bat, fzf, lazygit, superpowers) become 1000+ lines; their readers scroll for the install. Karpathy's skill puts the pick in order of preference ("Option A, Option B").
5. **Examples are one copy-paste block.** gum's tutorial is one commit-message walk-through; uv uses short console transcripts; aider shows 3 model commands. None shows internals before the first example.
6. **Reference moves out.** fzf: "see the man page for the full list of options". uv, gum, lazygit: flags and config live in `docs/` or `--help`. The README is a landing page; the long reference is a link.
7. **`<details>` is rare and used for platform noise** (distro installs, env vars), never for the pitch. Eight of eleven use none. They stay short another way: by linking out.
8. **Scannable shape beats prose.** Aider uses 9 icon-plus-sentence cards; gum repeats "snippet + GIF" per command; karpathy uses 4 numbered principles. Parallel facts are rows or cards, not paragraphs.
9. **Social proof is cheap and late or absent.** aider ends with user quotes; karpathy opens with named quotes. No README opens with its own test count.
10. **What they leave out:** architecture, file maps, severity rules, internals, changelogs, long flag lists, contribution detail. Where these exist they link to a file.
11. **The weakest above-the-fold pages** (lazygit: 44 lines of sponsor banners; fzf: merch banner; superpowers: a 30-line TOC) lose the tagline below the fold. Promotion above the pitch costs attention.

## What the current readmelyzer output does (measured on pr-gate)

pr-gate's README is 241 lines. Above the first screen: logo, tagline, 4 badges, an "At a glance" table, a 980 px diagram. That part is fine. Then it goes straight to Why (a second table), "What it did in practice" (4 long bullets), a 47-line Install with three tables and a mod sub-section, an Example, a 4-table "How it decides" section, Lean runs, Safety, Unattended and a Repo map. Eight tables, no `<details>`, no demo, no before/after. The reference is not "second": it is most of the page.

## Gaps against the patterns

| Pattern | Current output |
|---|---|
| Demo/visual proof in the first screen | a static flow diagram only; no terminal recording or screenshot |
| One-sentence promise + before/after | hook + a 3-cell table; no before/after |
| 3 scannable benefit cards | "Why" is a paragraph and a table |
| 30-second install | 5 steps, 47 lines, 3 tables, an optional mod |
| One copy-paste example with real output | present, but after ~120 lines |
| Internals out of the README | engines, severity rules, lean runs, repo map all inline |
| Hard length budget | none (the checker caps paragraphs only) |

## Addendum: what makes a README look engaging (visual study, 2026-10-11)

Added after the first pass read as correct but plain. Sources: the owner's profile README
(`EranTzarum/EranTzarum`) plus [ruflo/claude-flow](https://github.com/ruvnet/claude-flow),
[browser-use](https://github.com/browser-use/browser-use), [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill),
[opencode](https://github.com/sst/opencode), [mem0](https://github.com/mem0ai/mem0) and [repomix](https://github.com/yamadashy/repomix).

| What | Seen in | Why it works |
|---|---|---|
| **`for-the-badge` badges with logos, in brand colors**, grouped by role (tools, runtimes) | profile README (~35), ruflo, ui-ux-pro-max | Color and recognizable logos make a row of tools scannable in one glance |
| **Dashboard tiles**: stats cards, a streak card, a languages card, one theme (`radical`) | profile README | Numbers in colored tiles read as "alive, maintained"; one theme keeps it coherent |
| **Animated header or demo** (animated SVG/GIF banner, a screencast) | ruflo (neon GIF, animated console SVG), aider (animated SVG), vhs/gum GIFs | Motion at the top is the strongest hook; it needs no tools when written as SVG + CSS |
| **Feature cards as images** in a 2x2 or 1x3 grid, each with an icon and a color | ruflo (linked SVG cards), aider (icon + sentence) | Cards beat a text table for 3 benefits |
| **Light/dark `<picture>`** logos and diagrams | browser-use, opencode, repomix | Looks native in both GitHub themes |
| **Emoji or small icons in headings** used consistently | profile README, ruflo (custom SVG icons), repomix | A cheap visual rhythm; inconsistent use (repomix) looks careless |
| **One screenshot or demo image right under the title** | browser-use, opencode, ui-ux-pro-max (800 px), mem0 (banner) | Proof before prose |
| **Collapsed `<details>` for the long tail** | ruflo (heavy), browser-use FAQ (10 blocks) | Keeps a 550-line README feeling short |

Cautions seen: promo blocks above the pitch (lazygit, fzf, repomix sponsors), mixed badge styles on one page (repomix), 1000+ line reference READMEs with no visuals (bat), and third-party widget services that can break (github-readme-stats, streak-stats): prefer self-contained SVGs written into `docs/assets/` for anything the README depends on; use live widgets only when the owner already runs them.

Applied to pr-gate (branch `readme-engagement`): six `for-the-badge` tool/test badges, an animated terminal demo (SVG + CSS, loops, honors reduced-motion), four stat tiles, three SVG feature cards. All generated, self-contained, leak-checked.
