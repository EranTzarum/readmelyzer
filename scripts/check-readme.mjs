#!/usr/bin/env node
// Structural check for a README written with the writing-readmes recipe.
//   node check-readme.mjs [repo-root] [--file README.md]
// Prints one MISSING line per absent part and exits 1; exits 0 when the shape is complete.
// Checks structure only (headings, badges, images that exist on disk, blocks) — never content quality.
import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const root = resolve(args.find((a) => !a.startsWith("--")) ?? ".");
const fileIdx = args.indexOf("--file");
const file = fileIdx >= 0 ? args[fileIdx + 1] : "README.md";
const path = join(root, file);
if (!existsSync(path)) { console.log(`MISSING: ${file} not found in ${root}`); process.exit(1); }
const md = readFileSync(path, "utf8").replace(/\r\n/g, "\n");
const lines = md.split("\n");
const head = lines.slice(0, 40).join("\n");
const problems = [];
const has = (re, text = md) => re.test(text);

// 1. centered header with a title and badges
if (!has(/<div align="center">[\s\S]*?^# .+/m)) problems.push("centered header: <div align=\"center\"> containing an H1");
const badges = (md.match(/img\.shields\.io\/badge\//g) ?? []).length;
if (badges < 3) problems.push(`badges: at least 3 shields.io badges in the header (found ${badges})`);
// 2. TL;DR early
if (!has(/^## .*TL;DR/m)) problems.push("## TL;DR section");
// 3. hero image that exists on disk
const imgs = [...md.matchAll(/<img\s[^>]*src="([^"]+)"/g)].map((m) => m[1]);
if (!imgs.some((p) => /^docs\/assets\//.test(p) && [...head.matchAll(/<img\s[^>]*src="([^"]+)"/g)].some((h) => h[1] === p)))
  problems.push("hero image under docs/assets referenced in the first 40 lines");
for (const p of imgs) if (!existsSync(join(root, p))) problems.push(`image referenced but missing on disk: ${p}`);
if (imgs.length < 2) problems.push("at least two SVG/PNG visuals (hero + terminal-style output)");
// 4–14. required sections (emoji-tolerant, case-insensitive)
const sections = [
  ["Why", /^## .*\bwhy\b/im],
  ["Features", /^## .*features/im],
  ["Quick start", /^## .*quick\s*start/im],
  ["Usage", /^## .*usage/im],
  ["How it works", /^## .*how it works/im],
  ["Repository map", /^## .*(repository|repo) map/im],
  ["Verify", /^## .*verify/im],
  ["Extend", /^## .*extend/im],
  ["FAQ", /^## .*faq/im],
  ["License", /^## .*license/im],
];
for (const [name, re] of sections) if (!has(re)) problems.push(`## ${name} section`);
// quick start has a fenced block with a verify step
const qs = md.match(/^## .*quick\s*start[\s\S]*?(?=^## )/im)?.[0] ?? "";
if (!/```[\s\S]*?```/.test(qs)) problems.push("Quick start: fenced command block");
if (!/verify/i.test(qs)) problems.push("Quick start: a verify step (test or health command with expected output)");
// usage has a table
const usage = md.match(/^## .*usage[\s\S]*?(?=^## )/im)?.[0] ?? "";
if (!/^\|.*\|\s*\n\|[-| ]+\|/m.test(usage)) problems.push("Usage: a command table");
// FAQ has bold questions
const faq = md.match(/^## .*faq[\s\S]*?(?=^## )/im)?.[0] ?? "";
if ((faq.match(/^\*\*.+\?\*\*/gm) ?? []).length < 4) problems.push("FAQ: at least 4 bold questions");
// license links to a LICENSE file that exists
if (!/\]\(LICENSE[^)]*\)/.test(md)) problems.push("License: link to the LICENSE file");
else if (!existsSync(join(root, "LICENSE")) && !existsSync(join(root, "LICENSE.md"))) problems.push("LICENSE file missing on disk");
// filler
if (/\b(welcome to|in this (document|readme))\b/i.test(md)) problems.push("filler phrase (\"welcome to\", \"in this document\")");

if (problems.length) { for (const p of problems) console.log(`MISSING: ${p}`); process.exit(1); }
console.log(`README shape complete (${badges} badges, ${imgs.length} images, ${sections.length} sections)`);
