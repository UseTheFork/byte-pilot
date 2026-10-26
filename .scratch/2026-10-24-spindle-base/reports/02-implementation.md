# Ticket 02 implementation report

**Status:** implemented, all checks pass (not committed).
**Tested snapshot:** HEAD 03b6a41 + uncommitted working-tree changes listed below.
**TDD:** test-first. New tests were run before the production change and failed on the missing behavior (CLI emitted the usage error instead of the `just` error); infrastructure was valid. After implementing, all pass.

## Criteria -> tests
- Check before anything else, including arg validation: `tests/just-prerequisite.test.ts` cases "missing stack", "invalid stack", "unknown command", "no arguments" all still report the just error (and no usage/stack text).
- Missing `just` => non-zero exit, message and install link: asserted in every case (`https://just.systems/man/en/installation.html`).
- Nothing written to disk: project temp dir asserted empty (valid init case included).
- Never installs just: the check only scans PATH in-process; no spawn/install code.
- Existing behavior with just present: `tests/init.test.ts` (3 tests) run with a stub `just` dir prepended to PATH.

## Changed files
- `src/index.ts`: `requireJust()` PATH scan (`X_OK`, PATHEXT on win32) invoked first in `main()`.
- `tests/helpers.ts` (new): `makeTempDir` (os.tmpdir mkdtemp), `makeJustStubDir`, `runCli` (node absolute path + `--import` tsx absolute URL, custom PATH), `pathWith`.
- `tests/init.test.ts`: uses helpers; temp projects no longer in `.scratch`.
- `tests/just-prerequisite.test.ts` (new).

## Fresh checks
- `pnpm test`: 8 pass, 0 fail
- `pnpm lint`: clean
- `pnpm exec oxfmt --check src tests`: pass
- `pnpm build`: pass (build/ is gitignored; removed afterwards)

## Limitations
- Windows/PATHEXT path is untested (Linux only); on Windows `X_OK` is effectively an existence check.
- Directories named `just` on PATH would be unlikely but not excluded from `access` check.
