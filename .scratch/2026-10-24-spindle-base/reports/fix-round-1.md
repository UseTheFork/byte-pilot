# Corrective round 1

Starting snapshot: `3709521`. This round was not committed.

## F1 — Symlink-safe writes

Added a shared `assertSafeInstallPaths` guard in `src/install.ts`, used by both `init` and `update`. It uses `lstat` to reject symbolic links at `.github`, `.github/skills`, installed target skill directories, and `.github/spindle.json`, with an error naming the offending path. `init` checks before processing an existing config and again before installation; `update` checks before reading config or changing skills. CLI tests cover symlinked `.github`, `skills`, and target skills for both commands, and assert failure without changing the outside sentinel/content. Symlink tests are skipped on Windows.

## F2 — Strict config validation

`update` now requires `variables` to be present as a non-null, non-array object whose values are strings. Missing, null, array, and non-string values receive a malformed-config error advising to fix `.github/spindle.json` or run `spindle init`; no skill is changed. Existing fallback to manifest defaults for individual omitted variable entries is preserved, as covered by the existing test.

## TDD and fresh verification

- RED: Added CLI-seam regression coverage first. `pnpm test -- --test-name-pattern='symlink|malformed config'` ran the suite and reported 5 expected failures (the three `init` symlink cases, malformed-config coverage, and `update` symlink coverage); the remaining 42 tests passed. The script forwarded the extra argument, so the full suite ran rather than filtering.
- GREEN: `pnpm exec node --import tsx --test --test-name-pattern='symlink|malformed config' tests/init.test.ts tests/update.test.ts` — 5 passed, 0 failed.
- Fresh full suite: `pnpm test` — 47 passed, 0 failed (43 existing tests remain green; four new CLI tests added).
- `pnpm lint` — exit 0.
- `pnpm exec oxfmt --check src tests` — all 48 files formatted.
- `pnpm exec tsc --noEmit` — exit 0.
- `pnpm build` — exit 0.
- `git diff --check` — exit 0.

The repository tooling instructions reference a Just `tool` module, but `just tool::pnpm ...` could not run because this checkout reports `optional module 'tool' is absent`; the requested package checks were therefore run directly with pnpm. Existing unrelated `.scratch` edits were left untouched.
