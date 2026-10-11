#!/usr/bin/env node
// Builds the README's visual kit from one JSON spec: an animated terminal demo, stat tiles, feature cards.
//   node make-visuals.mjs <spec.json> [out-dir]      (out-dir defaults to the spec's folder)
// Spec: { palette?, demo?: {title, aria, rows:[{t, text}|null]}, cards?: [{color, title, icon, lines}], stats?: [{n, label, color?}] }
// Inline colors in demo text: {g:ok} {o:warn} {p:label} {m:muted} {b:bold prompt}. Nothing here invents numbers: every stat comes from the spec.
import { readFileSync, writeFileSync, mkdirSync, realpathSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const SANS = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
const TONES = { g: "#3fb950", o: "#f0883e", p: "#d2a8ff", m: "#8b949e", b: "#4ade80" };
const STAT_COLORS = ["#4ade80", "#22d3ee", "#FBBF24", "#C4B5FD"];
const ICONS = {
  search: `<circle cx="-2" cy="-2" r="9" fill="none" stroke="#fff" stroke-width="3"/><path d="M5 5l8 8" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>`,
  mail: `<path d="M-12 -8h24v16h-24z" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><path d="M-12 -8l12 10 12-10" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>`,
  shield: `<path d="M0 -12l11 4v8c0 7-5 11-11 14c-6-3-11-7-11-14v-8z" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><path d="M-5 1l4 4l7-8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
  bolt: `<path d="M3 -13l-11 15h8l-3 12l11-16h-8z" fill="#fff"/>`,
  check: `<path d="M-11 0l7 8l15 -16" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
};

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// "round 1 {o:[high]} x" -> tspans; text outside tokens is escaped.
export function runs(text) {
  let out = "", last = 0;
  for (const m of text.matchAll(/\{([gopmb]):([^}]*)\}/g)) {
    out += esc(text.slice(last, m.index));
    out += `<tspan fill="${TONES[m[1]]}"${m[1] === "o" || m[1] === "g" || m[1] === "b" ? ' font-weight="bold"' : ""}>${esc(m[2])}</tspan>`;
    last = m.index + m[0].length;
  }
  return out + esc(text.slice(last));
}

export function demoSvg({ title = "demo", aria = "Terminal demo", rows }, pal = {}) {
  const dark = pal.dark ?? "#052E16", mid = pal.mid ?? "#14532D", soft = pal.soft ?? "#86efac", dot = pal.prompt ?? "#4ade80";
  const D = 16, H = 90 + 24 * rows.length - 24;
  let css = ".l{white-space:pre}@keyframes dot{0%,100%{opacity:1}50%{opacity:.35}}.dot{animation:dot 1.6s infinite}", body = "";
  rows.forEach((r, i) => {
    if (!r) return;
    const y = 66 + 24 * i;
    if (i === 0) { body += `    <text class="l" x="24" y="${y}">${runs(r.text)}</text>\n`; return; } // stays visible: the loop never shows an empty window
    const a = (r.t / D) * 100;
    css += `@keyframes k${i}{0%,${a.toFixed(2)}%{opacity:0}${(a + 1.2).toFixed(2)}%,92%{opacity:1}97%,100%{opacity:0}}.k${i}{animation:k${i} ${D}s infinite}`;
    body += `    <text class="l k${i}" x="24" y="${y}">${runs(r.text)}</text>\n`;
  });
  css += "@media (prefers-reduced-motion:reduce){.l,.dot{animation:none!important;opacity:1}}";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="860" height="${H}" viewBox="0 0 860 ${H}" font-family="${MONO}" font-size="14" role="img" aria-label="${esc(aria)}">
  <style>${css}</style>
  <defs><linearGradient id="bar" x1="0" x2="1"><stop offset="0" stop-color="${dark}"/><stop offset="1" stop-color="${mid}"/></linearGradient></defs>
  <rect width="860" height="${H}" rx="10" fill="#0d1117"/>
  <path d="M0 10a10 10 0 0 1 10-10h840a10 10 0 0 1 10 10v24H0z" fill="url(#bar)"/>
  <circle cx="20" cy="17" r="6" fill="#ff5f56"/><circle cx="40" cy="17" r="6" fill="#ffbd2e"/><circle cx="60" cy="17" r="6" fill="#27c93f"/>
  <text x="430" y="22" text-anchor="middle" fill="${soft}" font-size="12">${esc(title)}</text>
  <circle class="dot" cx="836" cy="17" r="5" fill="${dot}"/>
  <g fill="#c9d1d9">
${body}  </g>
</svg>
`;
}

export function cardsSvg(cards) {
  const n = cards.length, w = Math.floor((940 - 26 * (n - 1)) / n), rowsMax = Math.max(...cards.map((c) => c.lines.length));
  const H = 108 + 24 * rowsMax;
  const aria = cards.map((c) => `${c.title}: ${c.lines.join(" ")}`).join(". ");
  const g = cards.map((k, i) => `  <g transform="translate(${i * (w + 26)} 0)">
    <rect width="${w}" height="${H}" rx="14" fill="#0d1117" stroke="${k.color}" stroke-opacity=".55"/>
    <rect width="${w}" height="6" rx="3" fill="${k.color}"/>
    <circle cx="44" cy="52" r="24" fill="${k.color}"/><g transform="translate(44 52)">${ICONS[k.icon] ?? ICONS.check}</g>
    <text x="80" y="60" font-size="22" font-weight="700" fill="#fff">${esc(k.title)}</text>
    ${k.lines.map((l, j) => `<text x="24" y="${104 + 24 * j}" font-size="16" fill="#c9d1d9">${esc(l)}</text>`).join("\n    ")}
  </g>\n`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="940" height="${H}" viewBox="0 0 940 ${H}" font-family="${SANS}" role="img" aria-label="${esc(aria)}">
${g}</svg>
`;
}

export function statsSvg(stats) {
  const n = stats.length, w = Math.floor((940 - 20 * (n - 1)) / n);
  const aria = stats.map((s) => `${s.n} ${s.label}`).join(", ");
  const g = stats.map((s, i) => {
    const c = s.color ?? STAT_COLORS[i % STAT_COLORS.length];
    return `  <g transform="translate(${i * (w + 20)} 0)">
    <rect width="${w}" height="96" rx="12" fill="#0d1117" stroke="${c}" stroke-opacity=".45"/>
    <rect x="0" y="90" width="${w}" height="6" rx="3" fill="${c}" opacity=".9"/>
    <text x="${w / 2}" y="48" text-anchor="middle" font-size="${String(s.n).length > 3 ? 30 : 38}" font-weight="800" fill="${c}">${esc(s.n)}</text>
    <text x="${w / 2}" y="74" text-anchor="middle" font-size="15" fill="#8b949e">${esc(s.label)}</text>
  </g>\n`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="940" height="96" viewBox="0 0 940 96" font-family="${SANS}" role="img" aria-label="${esc(aria)}">
${g}</svg>
`;
}

export function build(spec) {
  const out = {};
  if (spec.demo) out["demo.svg"] = demoSvg(spec.demo, spec.palette);
  if (spec.cards) out["cards.svg"] = cardsSvg(spec.cards);
  if (spec.stats) out["stats.svg"] = statsSvg(spec.stats);
  return out;
}

// real paths on both sides: run through a junction/symlink, argv[1] is the link but import.meta.url is the target
const real = (p) => { try { return realpathSync(p); } catch { return resolve(p); } };
if (process.argv[1] && real(process.argv[1]) === real(fileURLToPath(import.meta.url))) {
  const [specPath, outArg] = process.argv.slice(2);
  if (!specPath) { console.error("usage: make-visuals.mjs <spec.json> [out-dir]"); process.exit(2); }
  const dir = resolve(outArg ?? dirname(resolve(specPath)));
  mkdirSync(dir, { recursive: true });
  for (const [name, svg] of Object.entries(build(JSON.parse(readFileSync(specPath, "utf8"))))) {
    writeFileSync(join(dir, name), svg);
    console.log(`wrote ${join(dir, name)}`);
  }
}
