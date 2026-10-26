# 03 Rendering fidelity: implementation report

**Status:** complete, uncommitted.
**Snapshot:** HEAD c8435f3 plus working-tree changes (src/render.ts, src/index.ts, tests/rendering.test.ts, package.json, pnpm-lock.yaml).
**TDD:** tests written first; 5 new tests failed against the old code (env var ignored, no rendering), then passed after implementation.

## Criteria -> tests (tests/rendering.test.ts, CLI seam)
- `<%= %>` / `<% %>` render, stacks in context -> "variable output and tags render against stacks"
- `{{VSCODE_...}}`, `{{ }}`, `{% %}`, `{# #}` literal, autoescape off -> "VSCODE placeholders and braces are preserved literally..."
- Undefined variable is an error -> "an undefined variable fails init..."
- Nested sub-files install, rendered -> "sub-files install alongside the skill..."
- Non-text byte-for-byte (non-UTF-8 binary, .png, NUL-containing .md) -> "non-text files are copied byte for byte"

## Changes
- `src/render.ts` (new): Nunjucks env (autoescape off, throwOnUndefined, `<%= %>`, `<% %>`, `<# #>`); `renderFile` (extension allowlist + NUL + strict UTF-8 check). Tokenizer is patched per-instance because Nunjucks lexes `<%=` as a block start and `%>` as a block end when both share delimiters.
- `src/index.ts`: recursive `installDirectory`; `init(stacks, variables = {})` passes both to the render context; `SPINDLE_STUBS_DIR` overrides the stubs root (dir containing `skills/`), default stays module-relative `stubs/`.
- `package.json`/lockfile: `nunjucks`, `@types/nunjucks`.

## Fresh checks (all pass)
`pnpm test` (16 pass, 0 fail), `pnpm lint`, `pnpm exec oxfmt --check src tests package.json`, `pnpm exec tsc --noEmit`, `pnpm build`.

## Limitations
- The tokenizer patch relies on Nunjucks internals (`lexer.lex`, `_extractString`, `_matches`, `nextToken`); a `%>` inside a string literal within a tag is untested.
- Variable values are only exercised via `stacks`; `variables` is empty until ticket 04.
- Undefined-variable error text is Nunjucks's generic "attempted to output null or undefined value".
- Source import uses `./render.js` (tsc requires it).
