# Test workflow

`int-test-driven-development` defines task-level RED → GREEN and separate refactoring. Apply one sequence per assigned ticket, without a controller checkpoint or evidence matrix:

1. **RED.** Map acceptance criteria to covering behavioral tests, add or update those tests, and run them before changing production code. Confirm expected failures demonstrate missing behavior, not broken setup or unrelated errors. Existing behavior may already pass; do not manufacture failures.
2. **Implement the ticket.** Complete all required implementation changes. Intermediate test runs are optional; no per-behavior cycle or controller checkpoint is required.
3. **GREEN.** Run the new or changed tests and relevant regression checks against the completed implementation. After any later code edit, rerun affected checks. Correct regressions rather than weakening behavioral assertions.
4. **Save a concise report.** Write commands/results, the tested code snapshot, and any failures or checks not run to the assigned `.scratch` report. State whether the ticket began with covering failing tests or reused existing tests for a pure refactor. Archived RED output and controller release records are not required.

On resume, read the current report and rerun relevant tests if results are stale or missing. Missing old logs alone do not block continuation. Never invent a past test run or remove working code to manufacture RED history; disclose a skipped test-first step honestly. Current passing tests establish GREEN, not historical test order.

Pure refactors reuse existing behavioral tests and require no RED phase. **Complete when:** relevant tests pass after the final code edit, the report identifies what was checked, and limitations are explicit. Failed or unavailable required checks remain unresolved, not success.
