# Archetypes

Pick one in the design brief. Each gives a starting skeleton; drop sections with nothing true to say,
add one the project clearly needs. Section snippets live in `template.md`.

| Archetype | Reader wants | Hero | Section order | Example style |
|---|---|---|---|---|
| **Agent skill / plugin** | "What will my agent do differently?" | before → after flow | Logo+hook · At a glance · Hero · Why · What it does (features) · Install · Try it (example conversation) · How it works · Extend · FAQ · License | a short invented chat: user line → agent behaviour |
| **CLI** | "What do I type, what do I see?" | terminal output | Logo+hook · One-liner install · Hero (terminal) · Usage table · Common recipes · Config · How it works · FAQ · License | real command + real output, anonymized paths |
| **Library** | "What does the code look like?" | 5-line code sample | Logo+hook · Install · Quick example (code) · Hero (concept diagram) · API · Recipes · Compatibility · License | runnable snippet with neutral names (`orders`, `user`) |
| **App / product** | "What does it look like, can I run it?" | screenshot or mock | Logo+hook · Hero (screenshot) · Features · Run locally · Configuration · Architecture · Roadmap · License | screenshots with demo data only |
| **Template / starter** | "What do I get and how do I start?" | generated tree | Logo+hook · What's inside (tree) · Use this template · Customize · Scripts · License | the generated tree with placeholder names |
| **Workspace / monorepo** | "Where is what, who owns it?" | map diagram | Logo+hook · Map (table with each package's logo) · Get started · Conventions · Repository map · License | a package table, not a story |
| **Research / docs** | "What was found, where is the evidence?" | findings chart | Logo+hook · Key findings · Method · Evidence index · How to cite · License | a finding with its source, not a prompt |

## Section rules that hold for every archetype

- **Header:** logo (112 px), `# name`, a bold hook (the benefit), one plain line, badges.
- **At a glance:** a 3-cell table *You do · It does · You get*, or 2 sentences when a table feels forced.
- **Get started:** whatever the archetype calls it (Install, Quick start, Run locally, Use this template), it ends with a **verify** step and its expected output.
- **One concrete example** somewhere in the first half: real behaviour, anonymized in public mode.
- **Close:** license link and a one-line footer in the brief's voice.

## Choosing when it is ambiguous

- A skill that ships a CLI → agent skill (the agent is the user's entry point).
- A repo with many folders but one product → app/product, not workspace.
- A docs repo that also ships tooling → research/docs if the findings are the point.
