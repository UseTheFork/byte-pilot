# Ticket 09: `init` on an existing repo

**Status:** complete, uncommitted. **Snapshot:** HEAD `223cf16` plus changes in `src/index.ts`, `src/prompts.ts`, `tests/existing-repo.test.ts`.

## Implementation

- After the `just` check and command validation, `init` fails if `.github/spindle.json` exists (error points to `spindle update`), before flag/stack validation or prompts; nothing is written.
- New `--on-conflict <overwrite|skip>` (validated, documented in `--help`).
- Conflicts (existing skill dir with a shipped stub's name) are resolved before any write: policy flag, else a per-skill clack `select` prompt (`promptConflict` in `src/prompts.ts`), else (non-interactive) an error naming `--on-conflict`.
- Overwrite removes the skill directory then re-renders (equals a fresh install); skip leaves it untouched; new skills install alongside. Config is written afterwards.
- Success output: `Installed N skill(s) for <stacks>` plus `. Skipped M existing skill(s)` when M > 0.

## TDD

Tests were written first (`tests/existing-repo.test.ts`, 7 tests) and run before production changes; they failed as expected (missing flag/behavior). Covered: existing config (also before stack validation), overwrite with stale-file removal, skip with untouched files + new skill installed + config written, no-policy non-interactive error with nothing written, invalid flag value, `--help`. Interactive prompting is not tested.

## Final checks (after last edit)

- `pnpm test` — 33 passed, 0 failed
- `pnpm lint` — passed
- `pnpm exec oxfmt --check src tests` — passed
- `pnpm exec tsc --noEmit` — passed
- `pnpm build` — passed
