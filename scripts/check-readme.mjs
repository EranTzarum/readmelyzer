#!/usr/bin/env node
// Structural + privacy check for a README written with readmelyzer.
//   node check-readme.mjs [repo-root] [--file README.md] [--public] [--all-files]
// MISSING: a required part is absent.  LEAK: (with --public) private detail found.
// Exit 1 when anything is printed, 0 when clean. Never judges taste - the design brief does that.
import { readFileSync, existsSync, readdirSync, realpathSync } from "node:fs";
import { join, resolve, dirname, basename } from "node:path";
import { homedir } from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const imgsIn = (text) => [...text.matchAll(/<img\s[^>]*src="([^"]+)"/g)].map((m) => m[1]);
const DRAWN = /<(path|circle|ellipse|polygon|polyline|line)\b/;

export function loadPrivateTerms(file = join(homedir(), ".readmelyzer", "private-terms.txt")) {
  if (!existsSync(file)) return [];
  return readFileSync(file, "utf8").split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
}

export function findLeaks(text, terms = []) {
  const leaks = [];
  const add = (kind, m) => leaks.push(`${kind}: ${m.trim().slice(0, 60)}`);
  for (const m of text.matchAll(/\b[A-Za-z]:[\\/]{1,2}Users[\\/]{1,2}[^\\/\s"'`)<>]+/g)) add("user path", m[0]);
  for (const m of text.matchAll(/(?<![\w.~])\/(?:home|Users)\/(?!<)[A-Za-z0-9._-]+/g)) add("user path", m[0]);
  for (const m of text.matchAll(/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g))
    if (!/@(example\.(com|org)|users\.noreply\.github\.com)$/i.test(m[0])) add("email", m[0]);
  for (const t of terms) {
    const re = new RegExp(`(?<![\\w-])${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w-])`, "gi");
    for (const m of text.matchAll(re)) add("private term", m[0]);
  }
  return [...new Set(leaks)];
}

export function check(root, { file = "README.md", isPublic = false, allFiles = false, terms } = {}) {
  const path = join(root, file);
  if (!existsSync(path)) return { problems: [`MISSING: ${file} not found in ${root}`] };
  const md = readFileSync(path, "utf8").replace(/\r\n/g, "\n");
  const lines = md.split("\n");
  const top = (n) => lines.slice(0, n).join("\n");
  const problems = [];
  const miss = (m) => problems.push(`MISSING: ${m}`);
  const section = (re) => md.match(new RegExp(`^## .*(?:${re})[\\s\\S]*?(?=^## |(?![\\s\\S]))`, "im"))?.[0] ?? "";

  // Header: a drawn logo, distinct from sibling repos, a title, a hook, badges.
  const logoPath = join(root, "docs", "assets", "logo.svg");
  if (!imgsIn(top(15)).includes("docs/assets/logo.svg")) miss("logo: docs/assets/logo.svg shown in the header (first 15 lines)");
  if (existsSync(logoPath)) {
    const svg = readFileSync(logoPath, "utf8");
    if (svg.includes("{{")) miss("logo: template tokens left in docs/assets/logo.svg");
    if (!DRAWN.test(svg)) miss("logo: draw a pictogram (path/circle/polygon...), not only text or a tile");
    const parent = dirname(resolve(root));
    for (const sib of existsSync(parent) ? readdirSync(parent) : []) {
      const other = join(parent, sib, "docs", "assets", "logo.svg");
      if (sib !== basename(resolve(root)) && existsSync(other) && readFileSync(other, "utf8").replace(/aria-label="[^"]*"/, "") === svg.replace(/aria-label="[^"]*"/, ""))
        miss(`logo: identical to ../${sib}; draw this project's own metaphor`);
    }
  }
  if (!/<div align="center">[\s\S]*?^# .+/m.test(md)) miss("centered header: <div align=\"center\"> containing an H1");
  if (!/^\*\*[^*\n]+\*\*\s*$/m.test(top(20))) miss("hook: one bold line under the title");
  const badges = (md.match(/img\.shields\.io\//g) ?? []).length;
  if (badges < 3) miss(`badges: at least 3 shields.io badges (found ${badges})`);

  // Body: a hero, a way to start that verifies, a concrete example, a license.
  const imgs = imgsIn(md);
  if (!imgsIn(top(60)).some((p) => /^docs\/assets\//.test(p) && !/logo\.svg$/.test(p))) miss("hero: an image under docs/assets (not the logo) in the first 60 lines");
  for (const p of imgs) if (!/^https?:/.test(p) && !existsSync(join(root, p))) miss(`image referenced but missing on disk: ${p}`);
  const start = section("quick\\s*start|install|get(ting)? started|run locally|use this template|setup");
  if (!start) miss("get started: a Quick start / Install / Get started / Run locally section");
  else {
    if (!/```[\s\S]*?```/.test(start)) miss("get started: a fenced command block");
    if (!/verify|expected|you should see|→|#\s*(ok|pass)/i.test(start)) miss("get started: a verify step with expected output");
  }
  if (!/^#{2,3} .*(example|try it|recipes?|usage|in action|demo)/im.test(md)) miss("example: a section showing one concrete input → output (Example / Try it / Usage / Recipes)");
  if (!/\]\(LICENSE[^)]*\)/.test(md)) miss("license: link to the LICENSE file");
  else if (!existsSync(join(root, "LICENSE")) && !existsSync(join(root, "LICENSE.md"))) miss("license: LICENSE file missing on disk");

  // Voice
  if (/\b(welcome to|in this (document|readme))\b/i.test(md)) miss("voice: filler phrase (\"welcome to\", \"in this document\")");
  let run = 0, longest = 0, fence = false;
  for (const l of lines) {
    if (/^```/.test(l)) fence = !fence;
    run = !fence && /^[A-Za-z*_`"'(]/.test(l) && !/^\*\*.*\*\*$/.test(l.trim()) ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  if (longest > 4) miss(`voice: a paragraph runs ${longest} lines; keep paragraphs to 3-4 lines`);

  // Privacy
  if (isPublic) {
    const t = terms ?? loadPrivateTerms();
    let files = [file, ...imgs.filter((p) => /\.svg$/.test(p) && !/^https?:/.test(p))];
    if (allFiles) {
      try { files = execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" }).split("\n").filter(Boolean); } catch { /* not a git repo */ }
    }
    for (const f of new Set(files)) {
      let text;
      try { text = readFileSync(join(root, f), "utf8"); } catch { continue; }
      if (/\u0000/.test(text)) continue;
      if (text.includes("readmelyzer:allow-examples")) continue; // deliberate fake leaks (tests, demo output)
      for (const l of findLeaks(text, t)) problems.push(`LEAK: ${f}: ${l}`);
    }
  }
  return { problems, badges, imgs: imgs.length };
}

const real = (p) => { try { return realpathSync(p); } catch { return resolve(p); } };
if (process.argv[1] && real(process.argv[1]) === real(fileURLToPath(import.meta.url))) {
  const args = process.argv.slice(2);
  const root = resolve(args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--file") ?? ".");
  const fi = args.indexOf("--file");
  const r = check(root, { file: fi >= 0 ? args[fi + 1] : "README.md", isPublic: args.includes("--public"), allFiles: args.includes("--all-files") });
  if (r.problems.length) { for (const p of r.problems) console.log(p); process.exit(1); }
  console.log(`README complete${args.includes("--public") ? " and clean for public" : ""} (logo, ${r.badges} badges, ${r.imgs} images)`);
}
