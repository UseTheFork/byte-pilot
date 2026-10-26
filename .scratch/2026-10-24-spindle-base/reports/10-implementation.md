# Ticket 10 implementation report

Snapshot: working tree on top of latest commit (tickets 01-04, 06, 09). Not committed.

## Changes
- `src/install.ts` (new): shared stubs root, `exists`, `installDirectory`, stack/policy validation (moved from index.ts, init behaviour unchanged).
- `src/version.ts` (new): hand-rolled strict semver parse/compare, SKILL.md frontmatter `version` reader.
- `src/update.ts` (new): config read/validation (points to `init`), variable re-resolution (config → manifest default → error), outdated detection, policy/prompt, delete + re-render, summary. Never writes spindle.json.
- `src/prompts.ts`: `promptOutdated`. `src/index.ts`: `update` command, `update --help`, shared helpers; `update` rejects `--stack`/`--var`.
- `tests/update.test.ts` (new): 10 CLI-seam tests covering every criterion (newer/equal/lower/missing/non-semver, absent skill, overwrite with stored vars+stacks, skip, non-interactive error with nothing written, hand-edited config, default/required variables, invalid stack, missing/malformed config, just prerequisite, help).

## Results (after final edit)
- `pnpm test`: 43 pass, 0 fail
- `pnpm lint`, `pnpm exec oxfmt --check src tests`, `pnpm exec tsc --noEmit`, `pnpm build`: clean

## TDD note
Tests were written after the implementation in the same pass; no RED run was captured. The init refactor reused existing tests (all green).

## Notes
- Skipped-with-warning skills count toward "skipped" in the summary.
- A shipped stub lacking a valid semver version is an error.
- Bare `--help` still shows init help (with a pointer to update).
