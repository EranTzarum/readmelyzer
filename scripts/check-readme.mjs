#!/usr/bin/env node
// Structural check for a README written with the readmelyzer recipe.
//   node check-readme.mjs [repo-root] [--file README.md]
// Prints one MISSING line per absent part and exits 1; exits 0 when the shape is complete.
// Checks structure only (logo, headings, badges, images that exist on disk, blocks) - never writing quality.
import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function check(root, file = "README.md") {
  const path = join(root, file);
  if (!existsSync(path)) return { problems: [`${file} not found in ${root}`] };
  const md = readFileSync(path, "utf8").replace(/\r\n/g, "\n");
  const lines = md.split("\n");
  const top = (n) => lines.slice(0, n).join("\n");
  const problems = [];
  const has = (re, text = md) => re.test(text);
  const section = (re) => md.match(new RegExp(`^## .*${re}[\\s\\S]*?(?=^## |(?![\\s\\S]))`, "im"))?.[0] ?? "";
  const imgsIn = (text) => [...text.matchAll(/<img\s[^>]*src="([^"]+)"/g)].map((m) => m[1]);

  // 1. logo + centered header with a title and badges
  const logo = imgsIn(top(15)).find((p) => /^docs\/assets\/logo\.svg$/.test(p));
  if (!logo) problems.push("logo: docs/assets/logo.svg shown in the header (first 15 lines)");
  if (!has(/<div align="center">[\s\S]*?^# .+/m)) problems.push("centered header: <div align=\"center\"> containing an H1");
  if (!has(/^\*\*[^*\n]+\*\*\s*$/m, top(20))) problems.push("hook: one bold line under the title");
  const badges = (md.match(/img\.shields\.io\/badge\//g) ?? []).length;
  if (badges < 3) problems.push(`badges: at least 3 shields.io badges in the header (found ${badges})`);
  // 2. TL;DR with the at-a-glance table
  const tldr = section("TL;DR");
  if (!tldr) problems.push("## TL;DR section");
  else if (!/^\|.*\|\s*\n\|[-| :]+\|/m.test(tldr)) problems.push("TL;DR: an at-a-glance table (You do · It does · You get)");
  // 3. hero image that exists on disk, plus a second visual
  const imgs = imgsIn(md);
  const hero = imgsIn(top(50)).filter((p) => /^docs\/assets\//.test(p) && !/logo\.svg$/.test(p));
  if (!hero.length) problems.push("hero image under docs/assets (not the logo) in the first 50 lines");
  for (const p of imgs) if (!/^https?:/.test(p) && !existsSync(join(root, p))) problems.push(`image referenced but missing on disk: ${p}`);
  if (imgs.filter((p) => !/logo\.svg$/.test(p)).length < 2) problems.push("at least two visuals besides the logo (hero + terminal-style output)");
  // 4-14. required sections (emoji-tolerant, case-insensitive)
  const sections = [
    ["Why", /^## .*\bwhy\b/im], ["Features", /^## .*features/im], ["Quick start", /^## .*quick\s*start/im],
    ["Usage", /^## .*usage/im], ["How it works", /^## .*how it works/im], ["Repository map", /^## .*(repository|repo) map/im],
    ["Verify", /^## .*verify/im], ["Extend", /^## .*extend/im], ["FAQ", /^## .*faq/im], ["License", /^## .*license/im],
  ];
  for (const [name, re] of sections) if (!has(re)) problems.push(`## ${name} section`);
  const qs = section("quick\\s*start");
  if (!/```[\s\S]*?```/.test(qs)) problems.push("Quick start: fenced command block");
  if (!/verify/i.test(qs)) problems.push("Quick start: a verify step (test or health command with expected output)");
  if (!/^\|.*\|\s*\n\|[-| :]+\|/m.test(section("usage"))) problems.push("Usage: a command table");
  const faq = section("faq");
  const questions = (faq.match(/^\*\*.+\?\*\*|<summary>\s*(<b>)?[^<]*\?/gm) ?? []).length;
  if (questions < 4) problems.push(`FAQ: at least 4 questions (found ${questions})`);
  if (!/^> \[!(TIP|NOTE|IMPORTANT|WARNING|CAUTION)\]/m.test(md)) problems.push("callout: at least one > [!TIP] / [!NOTE] / [!WARNING]");
  if (!/\]\(LICENSE[^)]*\)/.test(md)) problems.push("License: link to the LICENSE file");
  else if (!existsSync(join(root, "LICENSE")) && !existsSync(join(root, "LICENSE.md"))) problems.push("LICENSE file missing on disk");
  // voice
  if (/\b(welcome to|in this (document|readme))\b/i.test(md)) problems.push("filler phrase (\"welcome to\", \"in this document\")");
  let run = 0, longest = 0, inFence = false;
  for (const l of lines) {
    if (/^```/.test(l)) inFence = !inFence;
    const prose = !inFence && /^[A-Za-z*_`"'(]/.test(l) && !/^\*\*.*\*\*$/.test(l.trim());
    run = prose ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  if (longest > 4) problems.push(`paragraph: one runs ${longest} lines; keep paragraphs to 3-4 lines`);
  return { problems, badges, imgs: imgs.length, sections: sections.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const root = resolve(args.find((a) => !a.startsWith("--")) ?? ".");
  const fi = args.indexOf("--file");
  const r = check(root, fi >= 0 ? args[fi + 1] : "README.md");
  if (r.problems.length) { for (const p of r.problems) console.log(`MISSING: ${p}`); process.exit(1); }
  console.log(`README shape complete (logo, ${r.badges} badges, ${r.imgs} images, ${r.sections} sections)`);
}
