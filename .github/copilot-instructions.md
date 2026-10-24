## Agent skills

### Issue tracker

Issues and specs are tracked as local Markdown under `.scratch/YYYY-MM-DD-<feature-slug>/`. See `docs/agents/issue-tracker.md` for creation-date naming and directory reuse.

### Triage labels

Use `Category: bug|enhancement` and the five canonical state values in `Status:`. See `docs/agents/triage-labels.md`.

### Domain docs

This is a multi-context repo; use `GLOSSARY-MAP.md` to find the relevant context glossary and consult `docs/adr/` for cross-context decisions. See `docs/agents/domain.md`.

## Project Tooling

You MUST use Just recipes instead of invoking the underlying tools directly. Before running project commands, read `docs/agents/tooling.md` for the available recipes and usage. Just selects the correct working directory.
