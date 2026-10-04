// node --test scripts/
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { check } from "./check-readme.mjs";

const GOOD = `<div align="center">

<img src="docs/assets/logo.svg" alt="demo logo" width="112">

# demo

**Ship it before lunch.**
A tiny demo project.

[![a](https://img.shields.io/badge/a-b-blue)](#) [![b](https://img.shields.io/badge/a-b-blue)](#) [![c](https://img.shields.io/badge/a-b-blue)](LICENSE)

</div>

## ⚡ TL;DR

| You do | It does | You get |
|---|---|---|
| run x | builds | a thing |

<p align="center"><img src="docs/assets/hero.svg" alt="hero" width="980"></p>

## 🤔 Why
Short.

## ✨ Features
- one

## 🚀 Quick start
\`\`\`bash
# 1. install
x
# 2. verify
y
\`\`\`

> [!TIP]
> Use y.

## 🧭 Usage
| Command | What happens |
|---|---|
| x | y |

<p align="center"><img src="docs/assets/term.svg" alt="term" width="860"></p>

## ⚙️ How it works
Ideas.

## 🗂 Repository map
tree

## 🧪 Verify
ok

## 🧩 Extend
- add

## ❓ FAQ
<details><summary><b>Does it overwrite?</b></summary>

No.
</details>
<details><summary><b>Secrets?</b></summary>

No.
</details>
<details><summary><b>Existing?</b></summary>

Fine.
</details>
<details><summary><b>Platforms?</b></summary>

All.
</details>

## 📄 License
[MIT](LICENSE)
`;

function repo(readme, { logo = true } = {}) {
  const d = mkdtempSync(join(tmpdir(), "readmelyzer-"));
  mkdirSync(join(d, "docs", "assets"), { recursive: true });
  for (const f of ["hero.svg", "term.svg"].concat(logo ? ["logo.svg"] : [])) writeFileSync(join(d, "docs", "assets", f), "<svg/>");
  writeFileSync(join(d, "LICENSE"), "MIT");
  writeFileSync(join(d, "README.md"), readme);
  return d;
}

test("complete README passes", () => {
  assert.deepEqual(check(repo(GOOD)).problems, []);
});

test("missing logo file is reported", () => {
  const p = check(repo(GOOD, { logo: false })).problems;
  assert.ok(p.some((x) => x.includes("missing on disk: docs/assets/logo.svg")), p.join("\n"));
});

test("no logo in header is reported", () => {
  const p = check(repo(GOOD.replace(/<img src="docs\/assets\/logo.svg"[^>]*>/, ""))).problems;
  assert.ok(p.some((x) => x.startsWith("logo:")), p.join("\n"));
});

test("TL;DR without the at-a-glance table is reported", () => {
  const p = check(repo(GOOD.replace(/\| You do[\s\S]*?\| run x \| builds \| a thing \|\n/, "Text only.\n"))).problems;
  assert.ok(p.some((x) => x.startsWith("TL;DR:")), p.join("\n"));
});

test("no callout is reported", () => {
  const p = check(repo(GOOD.replace("> [!TIP]\n> Use y.", ""))).problems;
  assert.ok(p.some((x) => x.startsWith("callout:")), p.join("\n"));
});

test("too few FAQ questions are reported", () => {
  const p = check(repo(GOOD.replace(/<details><summary><b>Platforms\?[\s\S]*?<\/details>/, ""))).problems;
  assert.ok(p.some((x) => x.startsWith("FAQ:")), p.join("\n"));
});

test("long paragraph is reported", () => {
  const p = check(repo(GOOD.replace("Short.", "One.\nTwo.\nThree.\nFour.\nFive."))).problems;
  assert.ok(p.some((x) => x.startsWith("paragraph:")), p.join("\n"));
});

test("filler is reported", () => {
  const p = check(repo(GOOD.replace("Short.", "Welcome to demo."))).problems;
  assert.ok(p.some((x) => x.startsWith("filler")), p.join("\n"));
});
