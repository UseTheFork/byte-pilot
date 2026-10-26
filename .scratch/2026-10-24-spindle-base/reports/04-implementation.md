# 04 implementation report

Status: complete (not committed). Tested snapshot: HEAD 50b23b0 plus the uncommitted working-tree changes listed below.

TDD: began with covering failing tests (`tests/variables.test.ts`: 7 of 8 failed before implementation; the empty-manifest case already passed). Then implemented and re-ran after the final code edit.

## Criteria -> tests
- Stacks required / repeatable flags: `init.test.ts` (existing), `variables.test.ts` "--no-interactive makes missing required input an error"
- Unknown stack rejected: `init.test.ts` existing invalid-stack test
- Variables: flags, defaults, overrides, `=` in values: "flags supply variables…", "a --var flag overrides…"
- Unknown variable / malformed `--var`: dedicated tests
- Config shape (string values, no per-skill): asserted via deepEqual in the variable tests; empty manifest -> `variables: {}`
- Missing required input exits non-zero naming the variable (never hangs; subprocess stdin is not a TTY): "a variable without default or flag…"
- Help (`--help`, `init --help`, exit 0, documents all flags): "help documents every flag and exits 0"
- Interactive prompts: not tested (spec allows); isolated in `src/prompts.ts` (@clack/prompts).

## Changed files
package.json (dependency, build copies all of `src/stubs`), pnpm-lock.yaml, src/index.ts, src/prompts.ts (new), src/variables.ts (new: manifest loader, `--var` parsing), src/stubs/variables.json (`[]`), tests/variables.test.ts (new).

## Fresh checks (all after final edit)
- `pnpm test`: 24 pass, 0 fail
- `pnpm lint`: clean
- `pnpm exec oxfmt --check src tests package.json`: clean
- `pnpm exec tsc --noEmit`: clean
- `pnpm build`: ok; `build/stubs/variables.json` present; `node build/index.js --help` and `init --help` exit 0 with a just stub on PATH.

## Limitations
- Interactive prompting is untested.
- A missing `<stubsRoot>/variables.json` is treated as no variables (fixture stubs in older tests omit it).
- Variable names are used as `variables.<name>` in templates, so they should be identifier-like (ticket 05).
- `--help` still requires `just` (requireJust runs first, as specified).
