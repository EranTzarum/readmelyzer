# Visual kit

What makes the top of a README look alive, built without external services. Source of the pattern:
`docs/research-readme-patterns.md` (addendum).

## 1. Tool badges (`for-the-badge`, logos, brand colors)

One badge per tool or runtime the project works with, then tests and license; 4-6 in a row.

```html
<a href="#install"><img src="https://img.shields.io/badge/Python_3-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3"></a>
```

`logo=` takes a simple-icons slug; the color is the tool's brand color. Do not mix badge styles on one page.

## 2. Spec and generator

Write `docs/assets/visuals.json` and run `node scripts/make-visuals.mjs docs/assets/visuals.json`:

| Key | Makes | Fields |
|---|---|---|
| `demo` | `demo.svg` animated terminal | `title`, `aria`, `rows: [{t, text}]` (`t` = seconds when the line appears; `null` = blank row). Inline colors `{g:ok} {o:warn} {p:label} {m:muted} {b:prompt}`. Row 0 stays visible, the rest loop |
| `cards` | `cards.svg` | `[{color, title, icon, lines}]`, icon = `search` `mail` `shield` `bolt` `check`, 3-4 lines of about 28 characters |
| `stats` | `stats.svg` | `[{n, label}]`, 3-4 tiles, optional `color` |
| `palette` | demo title bar | `dark`, `mid`, `soft`, `prompt` |

Rules:

- Every line and number is taken from the repo: test count from the test run, rounds from the code, minutes from a measured run.
- Public mode anonymizes the demo text like any example.
- A tile with nothing true to count is dropped, not invented.
- Colors: the brief's accent plus two complementary accents across cards and tiles.
- The SVGs carry their own dark panels, so they read in light and dark GitHub themes.
- Regenerate after any spec edit, and commit the JSON next to the SVGs so the next person can.

## 3. Checks

`check-readme.mjs` reports a malformed SVG (a quote inside an attribute silently breaks the image), a missing demo in
the first 40 lines, and the budget limits. It never judges taste.
