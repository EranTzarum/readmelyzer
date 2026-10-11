# Verify and extend

## Verify

```bash
node --test scripts/check-readme.test.mjs scripts/make-visuals.test.mjs
node scripts/check-readme.mjs . --public --all-files
```

The tests prove the checker accepts a lean README of any archetype, and rejects a missing or text-only logo, a logo copied from a sibling repo, a missing verify step or example, and long paragraphs. They also prove it catches user paths, emails and private terms as whole words. The second command proves this repo passes its own public check.

## Extend

- **Add an archetype:** a row in `references/archetypes.md` with its sections, hero and example style.
- **Add a pictogram primitive:** a line in the cookbook in `references/logo-guide.md`.
- **Add a privacy rule:** a pattern in `findLeaks()` in `scripts/check-readme.mjs`, plus a test in `scripts/check-readme.test.mjs`.

Back to the [README](../README.md).
