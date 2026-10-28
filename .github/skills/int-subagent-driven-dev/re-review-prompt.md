# Re-review dispatch prompt

Use this template once per corrective dispatch after code, task, or final aggregate review. It verifies the supplied findings and fix diff; it does not restart review or authorize another implementation round. The controller owns dispatch, acceptance, round budgets, and residual adjudication. A small diff may be reviewed directly by the controller.

## Prompt template

````md
Re-review this corrective round. Verify every supplied finding against the fix diff and inspect that diff for newly introduced regressions. Keep the review scoped to those findings and the fix.

**Task brief and spec:** [BRIEF_AND_SPEC_POINTERS]
**Applicable standards:** [POINTERS]
**Findings to verify, copied verbatim with stable IDs:** [FINDINGS]
**Review phase and persisted fix round/budget:** [PHASE_AND_ROUND]
**Prior verdicts and controller rulings:** [PRIOR_VERDICTS_AND_RULINGS]
**Implementer report with appended fix results:** [REPORT_FILE]
**Previous reviewed snapshot / fix base:** [FIX_BASE_SHA]
**Current head:** [HEAD_SHA]
**Fix-only diff package:** [DIFF_FILE]
**Assigned `.scratch` report path:** [REPORT_PATH]

Before reviewing, read and apply `int-test-driven-development` and `int-verification-before-completion`. Assess whether covering tests verify the fix at an appropriate boundary and pass on the current code. Fixes start with failing tests; pure refactors reuse existing tests. A concise test summary and fresh GREEN results are sufficient; archived RED logs, a matrix, and controller release records are unnecessary. Reviewers do not implement fixes or start a new TDD cycle.

Read the task brief, standards, prior review evidence, and implementer report. Treat claims as unverified. Read the supplied fix diff once; it contains the fix commits, stat, and diff with context. Do not rerun Git commands when the package is complete. If it is missing, obtain it with `git diff --stat [FIX_BASE_SHA]..[HEAD_SHA]` and `git diff [FIX_BASE_SHA]..[HEAD_SHA]`. Keep code, index, HEAD, and branch state unchanged. You may save only your assigned `.scratch` report, preserving history.

For every supplied finding, decide whether the specific defect no longer exists, with file:line evidence. `Attempted` is not addressed. Check the report's covering-test output against the exact fixed snapshot. Evidence from before a later edit is stale; missing, stale, or ambiguous required evidence leaves the finding `UNVERIFIED` and open. Do not rerun a suite to recreate missing evidence; ask the controller or implementer for current evidence. Run a focused check only when the diff raises a specific doubt the supplied evidence cannot resolve and the check cannot mutate the reviewed checkout. State the doubt and check. If initial task review has not happened, say so; scoped re-review does not replace it.

Inspect outside the fix diff only to resolve a named, concrete fix-induced risk. If the fix changes an acceptance criterion or broader contract, report the impact and request expanded review. Put issues entirely outside the fix diff under Out-of-Scope Observations; they do not block this round. Do not dispatch another reviewer or implementer, change the round budget, or widen the review silently.

Save the report at [REPORT_PATH]. Begin the returned report with the first finding's verdict, with no preamble or closing summary.

### Finding Verdicts

For each finding, in supplied order:

- **[stable ID and finding summary] — ADDRESSED | NOT ADDRESSED | UNVERIFIED:** file:line evidence and current covering-test evidence. Keep NOT ADDRESSED and UNVERIFIED findings open.

### New Breakage in the Fix Diff

List fix-induced issues with severity (Critical/Important/Minor), file:line, and impact, or `None`.

### Updated Spec and Quality

- **Spec:** PASS | FAIL | UNVERIFIED, mapping prior criteria/findings to fix-diff evidence.
- **Code review:** updated readiness for supplied findings, or not applicable; preserve unaffected evidence and identify any pending initial task review.
- **Quality:** PASS | FAIL | UNVERIFIED, including regressions and required test evidence.
- Identify any broader contract change and requested expanded review.

### Out-of-Scope Observations

List issues entirely outside the fix diff for the final review ledger, or `None`.

### Verdict

**Fix round:** [All findings addressed, no new Critical/Important breakage | Findings remain open]. List every NOT ADDRESSED and UNVERIFIED finding. Call the round complete only when all supplied findings are ADDRESSED, no new Critical/Important breakage remains, and Spec and Quality both PASS.

### Checks and Snapshot

State the exact fixed snapshot (SHA or working-tree/diff identity), implementer-reported commands and results inspected, reviewer-run checks and results, and limitations. Distinguish reported evidence from checks you ran.
````
