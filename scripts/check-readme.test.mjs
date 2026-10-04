// node --test scripts/check-readme.test.mjs
// readmelyzer:allow-examples - the leak tests below use invented paths and emails on purpose
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { check, findLeaks } from "./check-readme.mjs";

const LOGO = '<svg viewBox="0 0 128 128"><rect width="128" height="128" fill="#eef"/><circle cx="64" cy="64" r="30" fill="#33f"/></svg>';
const GOOD = `<div align="center">

<img src="docs/assets/logo.svg" alt="demo logo" width="112">

# demo

**Ship it before lunch.**
A tiny demo project.

[![a](https://img.shields.io/badge/a-b-blue)](#) [![b](https://img.shields.io/badge/a-b-blue)](#) [![c](https://img.shields.io/badge/a-b-blue)](LICENSE)

</div>

## At a glance

| You do | It does | You get |
|---|---|---|
| run x | builds | a thing |

<p align="center"><img src="docs/assets/hero.svg" alt="hero" width="980"></p>

## Install
\`\`\`bash
npm i demo
demo --version   # expected: 1.0.0
\`\`\`

## Example
Input a, output b.

## License
[MIT](LICENSE)
`;

function repo(readme, { logo = LOGO, parent } = {}) {
  const base = parent ?? mkdtempSync(join(tmpdir(), "readmelyzer-"));
  const d = join(base, `r${Math.random().toString(36).slice(2, 8)}`);
  mkdirSync(join(d, "docs", "assets"), { recursive: true });
  writeFileSync(join(d, "docs", "assets", "hero.svg"), "<svg/>");
  if (logo) writeFileSync(join(d, "docs", "assets", "logo.svg"), logo);
  writeFileSync(join(d, "LICENSE"), "MIT");
  writeFileSync(join(d, "README.md"), readme);
  return d;
}
const has = (r, prefix) => r.problems.some((x) => x.includes(prefix));

test("a lean README in any archetype passes", () => {
  assert.deepEqual(check(repo(GOOD)).problems, []);
});

test("missing logo file and missing logo in header are reported", () => {
  assert.ok(has(check(repo(GOOD, { logo: null })), "missing on disk: docs/assets/logo.svg"));
  assert.ok(has(check(repo(GOOD.replace(/<img src="docs\/assets\/logo.svg"[^>]*>/, ""))), "logo: docs/assets/logo.svg shown"));
});

test("a text-only or template logo is reported", () => {
  assert.ok(has(check(repo(GOOD, { logo: '<svg><rect width="9" height="9"/><text>R</text></svg>' })), "draw a pictogram"));
  assert.ok(has(check(repo(GOOD, { logo: "<svg>{{PICTOGRAM}}<circle r='1'/></svg>" })), "template tokens"));
});

test("a logo identical to a sibling repo's is reported", () => {
  const parent = mkdtempSync(join(tmpdir(), "ws-"));
  repo(GOOD, { parent });
  assert.ok(has(check(repo(GOOD, { parent })), "identical to ../"));
});

test("get started needs a fenced block and a verify step", () => {
  assert.ok(has(check(repo(GOOD.replace("demo --version   # expected: 1.0.0\n", ""))), "verify step"));
  assert.ok(has(check(repo(GOOD.replace("## Install", "## Notes"))), "get started:"));
});

test("a README without a concrete example is reported", () => {
  assert.ok(has(check(repo(GOOD.replace("## Example", "## Notes"))), "example:"));
});

test("long paragraph and filler are reported", () => {
  assert.ok(has(check(repo(GOOD.replace("Input a, output b.", "One.\nTwo.\nThree.\nFour.\nFive."))), "voice: a paragraph"));
  assert.ok(has(check(repo(GOOD.replace("Input a, output b.", "Welcome to demo."))), "voice: filler"));
});

test("findLeaks catches user paths, emails and private terms as whole words", () => {
  const l = findLeaks("see C:\\Users\\dana\\x and /home/dana/y, mail dana@corp.com, ok you@example.com, AcmeCRM acme-crm", ["acme-crm", "dana"]);
  assert.ok(l.some((x) => x.startsWith("user path: C:\\Users\\dana")));
  assert.ok(l.some((x) => x.startsWith("user path: /home/dana")));
  assert.ok(l.some((x) => x === "email: dana@corp.com"));
  assert.ok(!l.some((x) => x.includes("example.com")));
  assert.ok(l.some((x) => x === "private term: acme-crm"));
  assert.ok(!findLeaks("Copyright Danaher", ["dana"]).length, "whole words only");
});

test("--public reports leaks in README and its SVGs; clean README passes", () => {
  const d = repo(GOOD.replace("Input a, output b.", "Run it in C:\\Users\\dana\\shop."));
  const r = check(d, { isPublic: true, terms: ["shop"] });
  assert.ok(r.problems.some((x) => x.startsWith("LEAK: README.md: user path")));
  assert.ok(r.problems.some((x) => x.startsWith("LEAK: README.md: private term: shop")));
  assert.deepEqual(check(repo(GOOD), { isPublic: true, terms: ["shop"] }).problems, []);
});

test("CLI exits 1 on an incomplete README (guards the run-as-script check)", () => {
  const d = repo("# just a title\n");
  const r = spawnSync(process.execPath, [fileURLToPath(new URL("./check-readme.mjs", import.meta.url)), d], { encoding: "utf8" });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /MISSING: logo/);
});
