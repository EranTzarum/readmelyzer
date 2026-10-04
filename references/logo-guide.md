# Logo guide: draw the metaphor

The logo is a small flat pictogram of the brief's **metaphor**, in the brief's **palette**. It is drawn
by hand as SVG from primitives, inside the frame in `assets/logo.svg.tmpl`. It must read at 28 px
(a table cell) and at 112 px (the header).

## Process

1. **Metaphor → nouns.** "A magnifier over a page" → *page*, *magnifier*. Two nouns, three at most.
2. **Nouns → primitives.** Page = rounded rect + 3 lines. Magnifier = circle + short thick line.
   Speech bubble = rounded rect + small triangle. Path/flow = 3 dots joined by a curve.
3. **Compose with one focal point.** The main noun fills ~60 % of the canvas; the second overlaps
   it at a corner. Add at most one accent detail (a sparkle, a check, a dot) in the accent color.
4. **Color.** Background tile in `{{ACCENT_SOFT}}` (or none), main shapes in `{{INK}}` or white,
   one detail in `{{ACCENT}}`. Three colors total.
5. **Check it small.** Picture it at 28 px: if two details merge, delete one.

## Rules

- 128 x 128 canvas, 12 px safe margin, stroke widths 6-8 px with round caps and joins.
- No text in the pictogram unless the brief chose a wordmark. No letters as a default.
- No emoji, no gradients that carry meaning, no thin lines under 4 px.
- Distinct: before choosing, look at sibling repos' `docs/assets/logo.svg`. Different metaphor,
  different palette. Two repos never share both.

## Primitive cookbook (copy, move, scale)

```svg
<!-- page -->        <rect x="30" y="20" width="56" height="74" rx="8" fill="#fff" stroke="{{INK}}" stroke-width="6"/>
<!-- text lines -->  <path d="M42 40h32M42 54h32M42 68h20" stroke="{{INK}}" stroke-width="6" stroke-linecap="round"/>
<!-- magnifier -->   <circle cx="82" cy="78" r="18" fill="none" stroke="{{ACCENT}}" stroke-width="8"/><path d="M95 91l14 14" stroke="{{ACCENT}}" stroke-width="10" stroke-linecap="round"/>
<!-- sparkle -->     <path d="M100 18l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="{{ACCENT}}"/>
<!-- bubble -->      <path d="M22 28h72a10 10 0 0 1 10 10v34a10 10 0 0 1-10 10H52l-18 16v-16H22a10 10 0 0 1-10-10V38a10 10 0 0 1 10-10z" fill="#fff" stroke="{{INK}}" stroke-width="6" stroke-linejoin="round"/>
<!-- check -->       <path d="M44 56l12 12 24-24" fill="none" stroke="{{ACCENT}}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
<!-- arrow up-right --><path d="M40 88L88 40M60 40h28v28" fill="none" stroke="{{ACCENT}}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
<!-- stacked tiles --><rect x="24" y="24" width="36" height="36" rx="8" fill="{{INK}}"/><rect x="68" y="24" width="36" height="36" rx="8" fill="{{ACCENT}}"/><rect x="24" y="68" width="80" height="36" rx="8" fill="{{INK}}" opacity=".35"/>
<!-- path of steps --><path d="M24 96C48 96 44 64 64 64S84 32 104 32" fill="none" stroke="{{INK}}" stroke-width="6" stroke-dasharray="2 12" stroke-linecap="round"/><circle cx="24" cy="96" r="8" fill="{{INK}}"/><circle cx="104" cy="32" r="10" fill="{{ACCENT}}"/>
```

## Worked examples

| Project shape | Metaphor | Pictogram |
|---|---|---|
| README generator | a magnifier over a page, with a sparkle | page + text lines, magnifier at bottom-right, sparkle top-right |
| Prompt restructurer | a messy speech bubble that becomes a checklist | bubble whose inside holds 3 check rows; one check in accent |
| Project pre-flight | a runway of checkpoints leading to take-off | dotted path of steps rising to the right, ending in an accent dot / arrow |
| Workspace / monorepo | tiles that fit together | stacked tiles, one in accent |
| Data pipeline | streams merging into one | three curves joining into one arrow |
| Security tool | a shield with a keyhole | shield outline, keyhole in accent |
