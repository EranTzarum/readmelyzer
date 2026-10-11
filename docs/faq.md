# FAQ

<details><summary><b>Will it overwrite my README?</b></summary>

It rewrites it around the new brief and keeps every true fact and link. The diff shows what moved and what was dropped as stale.
</details>

<details><summary><b>I already have a logo. Will it replace it?</b></summary>

No. If your logo fits the brief it stays; readmelyzer only draws one when there is none, or when you ask.
</details>

<details><summary><b>Does it touch code, secrets or git?</b></summary>

No. It writes `README.md`, files under `docs/assets/`, and a `LICENSE` if none exists. Committing is up to you.
</details>

<details><summary><b>Does public mode clean my git history too?</b></summary>

No. It cleans the current files and tells you that history still holds the old text. Publishing safely then means a fresh repo from a clean snapshot, or a history rewrite.
</details>

<details><summary><b>Where is my private-terms list stored?</b></summary>

In `~/.readmelyzer/private-terms.txt`, in your home folder. It's never written into a repo.
</details>

<details><summary><b>Does it need any API key or design tool?</b></summary>

No. Logos and diagrams are hand-written SVG, and the checker is plain Node with no dependencies.
</details>

Back to the [README](../README.md).
