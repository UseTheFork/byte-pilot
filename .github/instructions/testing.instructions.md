---
name: Testing
description: Use when creating or changing tests, including when no test file is open.
applyTo: "**/*.test.{ts,js,cjs,mjs}"
---

# Testing

- Write tests with the built-in `node:test` runner (`test`, `describe`) and `node:assert/strict`; the project's existing tests follow this and it keeps the dependency list empty.
- Run TypeScript tests through `tsx` (already a dev dependency) rather than adding a test framework such as Vitest or Jest.
- Name files `<topic>.test.ts` next to the area they cover, or under `tests/` for CLI-level tests.

```ts
import { test } from "node:test";
import assert from "node:assert/strict";

test("exits non-zero when just is missing", () => {
  assert.equal(result.status, 1);
});
```
