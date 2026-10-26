# Ticket 06: Ship internal skills

**Status:** complete, uncommitted.  
**Snapshot:** HEAD `6c32d35` plus the changes described here.

## Implementation

- Copied all 14 current `int-*` skill directories, including their nested files, into `src/stubs/skills/` with `cp -R`.
- Added `version: 1.0.0` immediately after `name:` in each stub `SKILL.md`; no other source skill content changed.
- Removed `src/stubs/skills/spindle-placeholder`.
- Updated init tests to use `SPINDLE_STUBS_DIR` fixtures and moved their temporary directories under `.scratch/`.
- Added production-stub CLI comparison and shipped-frontmatter semver tests in `tests/stubs.test.ts`.

## TDD evidence

Added the covering tests before copying the production skills. The initial focused run had 7 passing tests and 1 expected failure: default init installed no `int-*` directories, while `.github/skills` contains 14. The version invariant passed against the pre-existing placeholder stub. After implementation, the targeted tests passed; the final full suite also passed.

The production CLI test compares the installed internal-skill directory set and all files against `.github/skills`, removing only the one added `version: 1.0.0` line for each `SKILL.md` comparison. The shipped-content test reads every `SKILL.md` under `src/stubs/skills` and validates its frontmatter version as semver.

A grep check found no `<%` or `<#` delimiters in the shipped internal skills, so none are subject to Nunjucks rendering changes. The formatter check did not flag stub markdown; no formatter ignore change was needed.

## Final checks

- `pnpm test` — 26 passed, 0 failed.
- `pnpm lint` — passed.
- `pnpm exec oxfmt --check src tests` — passed.
- `pnpm exec tsc --noEmit` — passed.
- `pnpm build` — passed.
- `grep -R -n -E '<%|<#' src/stubs/skills/int-*` — no matches.

The repository's Just `pnpm` recipe targets `packages/orchestration`; the requested checks were run with pnpm at this checkout's package root.
