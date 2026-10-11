// node --test scripts/make-visuals.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { build, runs, esc } from "./make-visuals.mjs";

const SPEC = {
  demo: { title: "demo · a/b#1", aria: "Terminal: it works", rows: [
    { t: 0.4, text: "{b:$ }run it" }, { t: 1.6, text: "ok {g:clean} & <done> \"quoted\"" }, null, { t: 3, text: "{p:Label:} detail" }] },
  cards: [{ color: "#16A34A", title: "Fast", icon: "bolt", lines: ["one", "two"] }, { color: "#0891B2", title: "Safe", icon: "nope", lines: ["x"] }],
  stats: [{ n: "74", label: "tests" }, { n: "1–5 min", label: "per round" }, { n: "3", label: "rounds" }],
};
// attribute values must never contain a raw double quote (the bug that breaks images silently)
const wellFormed = (svg) => /^<svg[\s>]/.test(svg) && /<\/svg>\s*$/.test(svg) && !/<[a-zA-Z][^<>]*\s[\w:-]+="[^"<>]*"(?=[^\s/>])/.test(svg);

test("build writes only the requested sections and every SVG is well-formed", () => {
  const out = build(SPEC);
  assert.deepEqual(Object.keys(out).sort(), ["cards.svg", "demo.svg", "stats.svg"]);
  for (const [name, svg] of Object.entries(out)) assert.ok(wellFormed(svg), `${name} well-formed`);
  assert.deepEqual(Object.keys(build({ stats: SPEC.stats })), ["stats.svg"]);
});

test("demo: text is escaped, tokens become colored tspans, first row stays visible, reduced motion is honored", () => {
  const svg = build(SPEC).demo ?? build(SPEC)["demo.svg"];
  assert.match(svg, /&amp; &lt;done&gt; &quot;quoted&quot;/);
  assert.match(svg, /<tspan fill="#3fb950" font-weight="bold">clean<\/tspan>/);
  assert.match(svg, /<text class="l" x="24" y="66">/); // row 0 has no animation class
  assert.match(svg, /class="l k1"/);
  assert.match(svg, /prefers-reduced-motion/);
  assert.ok(!/class="l k2"/.test(svg), "a null row is skipped");
});

test("cards and stats: aria-label carries the real text, unknown icon falls back, numbers come only from the spec", () => {
  const out = build(SPEC);
  assert.match(out["cards.svg"], /aria-label="Fast: one two\. Safe: x"/);
  assert.match(out["stats.svg"], /aria-label="74 tests, 1–5 min per round, 3 rounds"/);
  assert.equal((out["stats.svg"].match(/<text [^>]*font-weight="800"/g) ?? []).length, 3);
});

test("esc and runs leave plain text alone and escape markup", () => {
  assert.equal(esc(`a&b<c>"d'`), "a&amp;b&lt;c&gt;&quot;d&#39;");
  assert.equal(runs("plain"), "plain");
  assert.equal(runs("{o:x}"), '<tspan fill="#f0883e" font-weight="bold">x</tspan>');
});
