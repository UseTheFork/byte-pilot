# Ticket 01 implementation report

## Status

Implemented the non-interactive `spindle init` walking skeleton. No commit was created. The ticket's `Execution` and `Status` lines were not edited.

## Tested snapshot

- Base revision: `9f324e74fcdc81190013598d74e06d28553f16d6`
- Final state: working-tree changes listed below; `pnpm-lock.yaml` unchanged.
- TDD evidence: added the CLI process-boundary tests first and confirmed the direct `tsx` test run exited non-zero before `src/index.ts` existed. Implemented the command and reran the suite to GREEN.

## Acceptance criteria → evidence

| Criterion | Evidence |
| --- | --- |
| Expose `spindle`, not `byte`; executable points at `build/index.js` | `package.json` inspection: `{"spindle":"./build/index.js"}` with no `byte`; build applies executable permissions. `pnpm pack --dry-run` includes `build/index.js`. |
| Repeatable `--stack` accepts supported ids and writes config shape | `tests/init.test.ts`: valid repeated flags; parsed config deep-equals `{ stacks: ["php-laravel", "typescript"], variables: {} }`. No-stack and unsupported-stack subprocess cases also assert failure and no config. |
| Placeholder stub installs at `.github/skills/<name>/SKILL.md` with semver version | Process test asserts installed path, content, and semver frontmatter. `pnpm pack --dry-run` includes source and built stub. A direct run of `build/index.js` from a project cwd also verified config and skill output. |
| Success/failure exit codes | Process tests assert status `0` for success and non-zero for missing/invalid stack, with clear error text. |
| Real CLI subprocess in project directory | `tests/init.test.ts` invokes the `tsx` CLI subprocess with each temporary project as `cwd`, then asserts exit status, installed skill, and config contents. Test directories are created under repository `.scratch/` and removed afterward. |

## Fresh check results

- `pnpm test` — passed, 3/3 tests.
- `pnpm lint` — passed.
- `pnpm fmt:check` — failed on seven unchanged pre-existing files under `.github/` (five agent/instruction files and `.github/skills/improve-codebase-architecture/HTML-REPORT.md`). Changed-file check `pnpm exec oxfmt --check package.json tsconfig.json src/index.ts tests/init.test.ts` — passed. No unrelated formatting changes were made.
- `pnpm build` after removing generated `build/` — passed. Repeated build verified there is a single module-relative stub tree.
- `pnpm pack --dry-run` — passed; includes `build/index.js`, built stub, and `src/stubs` source.
- Built CLI subprocess smoke check — passed from a separate project cwd.

## Changed files

- `package.json` — test script, packaged stubs, idempotent stub-copy build step; existing `spindle` bin retained.
- `tsconfig.json` — minimal strict ESM/NodeNext build configuration.
- `src/index.ts` — non-interactive `init`, stack validation, stub installation, config writing, and error exit handling.
- `src/stubs/skills/spindle-placeholder/SKILL.md` — simple versioned placeholder.
- `tests/init.test.ts` — subprocess-level success and validation coverage.
- `.scratch/2026-10-24-spindle-base/reports/01-implementation.md` — this report.

## Limitations

Only the ticket's requested walking skeleton is implemented. `update`, `just` prerequisite checks, variables/prompts, rendering delimiters, and existing-skill conflict handling remain out of scope. Repository-wide formatting remains blocked by the listed unrelated baseline files.
