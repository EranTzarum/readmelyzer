# Demo guide

The first screen needs proof, not a diagram: one real command and what it prints. Pick the lightest
option that shows the truth.

| Option | When | Cost |
|---|---|---|
| **Animated terminal SVG (default)** | Any CLI, skill or script with text output | None. `scripts/make-visuals.mjs` writes `docs/assets/demo.svg` from `docs/assets/visuals.json` (6-12 lines of real output, loops, honors reduced motion). `assets/terminal.svg.tmpl` is the static fallback |
| **Screenshot** (PNG, 1200 px wide max) | An app, a UI, a TUI | A screenshot with demo data only |
| **Terminal recording → GIF** | Something that moves: a prompt, a progress bar, an interactive picker | `vhs` (a `.tape` file → GIF, scriptable, reproducible) or `asciinema` + `agg`. Install them only when the user agrees |
| **AI-generated hero image** (optional) | A brand-style banner or illustration above the demo, never instead of it | Codex, ChatGPT or Gemini. See below |

## Terminal SVG rules

- Run the command for real, copy the output, then trim it to the lines that prove the point.
- Colors from the brief's palette for the title bar and prompt; green for ok, orange for warn.
- File lives at `docs/assets/demo.svg` (the checker looks for `demo`, `terminal`, `screen`, `record`, `session`, `preview` or a `.gif/.png/.webp` in the name).
- Height = 90 + 24 × lines. Width 860 shows without scrolling on a phone.
- Public mode: the output is anonymized like any example (invented repo, user and path names). The checker scans the SVG for leaks.

## Recording a GIF (when it is worth it)

```bash
# vhs: write demo.tape, run it, commit the GIF
vhs demo.tape            # Output docs/assets/demo.gif, Set Width 1000, Set FontSize 18
# asciinema: record, then convert
asciinema rec demo.cast && agg demo.cast docs/assets/demo.gif
```

Keep a GIF under 8 s and 1 MB; show the one command, not setup. Run it in a scratch folder with
invented data so no real path or name appears in a frame.

## Using an AI image tool (optional)

Good for a banner, a metaphor illustration or a social card. Not for the demo itself (it must be real).

- Give the tool the **brief only**: archetype, metaphor, palette hex values, personality. Never paste repo files, real prompts, logs, paths or names.
- Ask for no text in the image (generated text is wrong often); the title stays real text in the README.
- Save as PNG/WebP under 300 KB in `docs/assets/`, with alt text. In public mode, view it once for anything that looks like a real name or logo.
- This is a visual upgrade. The default flow never needs it.
