<!-- BUDGET (checked): pitch ≤ 40 lines before the first "## ", demo in the first 40 lines, at most one table
     before the first example, example by line 100, whole README ≤ 160 lines. Modules from "How it works" down are
     REFERENCE: put each in docs/<topic>.md with one link, or fold it in <details>. -->
<!-- Module library, not a fixed order. references/archetypes.md picks the modules and their order for this
     project; drop any module with nothing true to say. {{ACCENT_HEX}} = the brief's accent without '#'. -->
<div align="center">

<img src="docs/assets/logo.svg" alt="{{NAME}} logo" width="112">

# {{NAME}}

**{{HOOK — the benefit in one bold line, e.g. "Long prompts in, finished work out."}}**
{{ONE PLAIN LINE — what the reader gets, in words a newcomer knows.}}

<a href="#-quick-start"><img src="https://img.shields.io/badge/{{Tool}}-{{BRAND_HEX}}?style=for-the-badge&logo={{simple-icons-slug}}&logoColor=white" alt="{{Tool}}"></a>
<a href="#-quick-start"><img src="https://img.shields.io/badge/tests-{{N}}_passing-16A34A?style=for-the-badge" alt="{{N}} tests passing"></a>
<a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-052E16?style=for-the-badge" alt="MIT license"></a>
<!-- 4-6 for-the-badge badges: one per tool/runtime it works with (logo = a simple-icons slug, color = the tool's brand color), then tests and license. -->

<br>

<img src="docs/assets/demo.svg" alt="{{real output of the one command}}" width="860">

<br>

<img src="docs/assets/stats.svg" alt="{{N}} tests passing, {{other true numbers}}" width="860">

</div>

**Before:** {{what the reader did by hand — one or two lines.}}
**After:** {{what they do now — one line, the command.}}

<p align="center">
  <img src="docs/assets/cards.svg" alt="{{the three benefits, as text}}" width="860">
</p>
<!-- demo.svg, stats.svg and cards.svg come from docs/assets/visuals.json via scripts/make-visuals.mjs (references/visual-kit.md). -->

---

## 🚀 Quick start

```bash
# 1. install
{{install command}}

# 2. verify
{{verify command}}   # {{expected output}}

# 3. first run
{{first command}}
```

> [!TIP]
> {{The shortcut or gotcha people miss on day one.}}

<details>
<summary><b>{{Other platforms / harnesses}}</b></summary>

| {{Platform}} | {{Path or command}} |
|---|---|
| {{…}} | {{…}} |

</details>

---

## 🧭 Usage

| Command | What happens |
|---|---|
| `{{cmd}}` | {{…}} |

<p align="center">
  <img src="docs/assets/{{terminal}}.svg" alt="{{real output of the command below}}" width="860">
</p>

```bash
{{the exact command that produced it}}
```

---

## ⚙️ How it works

```mermaid
sequenceDiagram
    participant You
    participant {{Tool}}
    You->>{{Tool}}: {{…}}
    {{Tool}}-->>You: {{…}}
```

1. **{{Idea.}}** {{why it matters}}.
2. **{{Idea.}}** {{…}}.

| Part | Takes | Produces |
|---|---|---|
| `{{file}}` | {{…}} | {{…}} |

---

## 📦 What lands in your project

```
{{path}}              {{what it is, in a few words}}
```

---

## 🗂 Repository map

<details>
<summary><b>Show the tree</b></summary>

```
{{file}}              {{purpose}}
```

</details>

---

## 🧪 Verify

```bash
{{test command}}
```

{{One or two sentences: what passing proves.}}

---

## 🧩 Extend

- **{{Add X}}** — {{file to touch}}.
- **{{Add Y}}** — {{…}}.
- **{{Add Z}}** — {{…}}.

---

## ❓ FAQ

<details><summary><b>Does it overwrite my files?</b></summary>

{{one-line answer}}
</details>

<details><summary><b>Does it touch secrets, commit or deploy?</b></summary>

{{…}}
</details>

<details><summary><b>What if I already have {{…}}?</b></summary>

{{…}}
</details>

<details><summary><b>{{Platform question}}?</b></summary>

{{…}}
</details>

---

## 📄 License

[MIT](LICENSE) © {{year}} {{owner}}

<div align="center"><sub>{{one warm closing line, e.g. "Made for agents that should finish what they start."}}</sub></div>
