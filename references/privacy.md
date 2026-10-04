# Privacy: writing a README that is safe to share

Use public mode by default when a repo will be shown to people outside the author's team (GitHub,
LinkedIn, a portfolio). The reader should learn the project, not the author's private work.

## Remove or replace

| Kind | Example in a private repo | Public version |
|---|---|---|
| Absolute user paths | `C:\Users\dana\Projects\shop\` | `~/projects/my-app/` or `<repo>` |
| Usernames, emails, account ids | `dana@corp.com`, `org_9f3a…` | omit, or `you@example.com` |
| Private project / client names | "the Acme CRM", "ShopBot" | "a multi-tenant web app", "a chat bot" |
| Real prompts and logs | a 4 000-char prompt with terminal output | a 3-line invented prompt with the same problem shape |
| Personal dates and timelines | "on 2026-08-23 the overnight run…" | "during a long unattended run…" |
| Internal URLs, dashboards, project refs | `https://xyz.supabase.co` | `https://<your-project>.supabase.co` |
| Secrets (never, in any mode) | keys, tokens, passwords | a variable name only: `SUPABASE_URL` |

Keep: the author's name in the license and badges, the public repo URL, test counts and other facts
about the project itself.

## Anonymize an example without losing it

1. Write down the **problem shape**: "a long message mixing logs and four questions; one question
   was silently dropped".
2. Invent neutral specifics with the same shape: a generic app, generic log lines, four ordinary
   questions.
3. Keep the **lesson** and the **before → after** exactly as they happened.

## Private terms file

`~/.readmelyzer/private-terms.txt`, one term per line, `#` for comments, matched case-insensitively
as whole words. `check-readme.mjs --public` reads it and reports every hit as `LEAK:`. It must never
be committed: it lists exactly what must not be public.

```text
# ~/.readmelyzer/private-terms.txt
acme-crm
shopbot
dana
```

## Deliberate examples

A file that must contain fake leaks (checker tests, a demo of the checker's output) opts out with the
marker `readmelyzer:allow-examples` anywhere in it. Use invented values only; real ones stay out.

## Beyond the README

A public repo leaks through fixtures, docs, examples and commit history too. In public mode:

- scan every tracked text file with the same rules (`--public --all-files`);
- anonymize fixtures and docs the same way, keeping their shape so tests still pass;
- tell the user that **git history still holds the old text**; making the repo public safely needs a
  fresh history (a new repo from a clean snapshot) or a history rewrite, which is their call.
