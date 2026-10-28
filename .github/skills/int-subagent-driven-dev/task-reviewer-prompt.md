# Task reviewer dispatch prompt

Use this copy-ready prompt for the separate Spec and Quality review after code review. For a small diff the controller may review directly; otherwise assign one read-only reviewer to both review axes.

## Prompt template

````md
Review this task's implementation against its requirements and quality standards. This is a task-scoped gate, not a merge review; aggregate code review happens separately.

**Ticket and spec, including comments:** [BRIEF_AND_SPEC_POINTERS]
**Acceptance criteria:** [CRITERIA]
**Global constraints:** [VERBATIM_CONSTRAINTS]
**Applicable instructions and standards:** [POINTERS]
**Workspace and exact snapshot:** [WORKSPACE_AND_SNAPSHOT]
**Base / head:** [BASE_SHA] / [HEAD_SHA]
**Complete task diff:** [DIFF_FILE_OR_COMMAND]
**Implementation report:** [REPORT_FILE]
**Verification output and test summary for this snapshot:** [EVIDENCE]
**Known concerns and dependencies:** [CONCERNS_AND_DEPENDENCIES]
**Prior code-review evidence, finding IDs, rulings, and fix-round count:** [PRIOR_REVIEW_STATE]
**Assigned `.scratch` report path:** [REPORT_PATH]

Read the supplied sources and compare the actual diff with the claims. Verify every criterion; inspect related code only where a concrete risk requires it. Keep code and Git state unchanged. You may save your assigned `.scratch` report, preserving prior history. Do not dispatch other reviewers.

Read the supplied diff file once: it contains the commit list, stat summary, and full diff with surrounding context, and is your view of the change. Do not reread changed files unless a required hunk is cut off mid-function; state that limitation in the report. Do not rerun Git commands when the supplied diff is complete. If it is missing, obtain it using the provided command or `git diff --stat [BASE_SHA]..[HEAD_SHA]` and `git diff [BASE_SHA]..[HEAD_SHA]`. Do not crawl the broader codebase. Inspect outside the diff only to evaluate a named concrete risk; perform one focused check per risk and name the risk and check.

Keep code, index, HEAD, and branch state unchanged. Run a focused check only when the diff raises a specific doubt that existing evidence cannot resolve, and only if it cannot mutate the reviewed checkout. Otherwise name the limitation and required check. Do not rerun suites merely to confirm a legible report. Distinguish reviewer-run checks from implementer-reported evidence.

Treat the implementer's report and design rationales as unverified claims. Verify claims against the diff; a rationale such as “left it per YAGNI” does not reduce a finding's severity.

Before reviewing, read and apply `int-test-driven-development` and `int-verification-before-completion`. Assess behavioral coverage and current test results; do not implement or start a TDD cycle. Use [the test workflow](tdd-evidence.md) to distinguish behavior changes from pure refactors. Behavior changes and fixes start with failing tests; pure refactors reuse existing tests. A concise test summary and fresh GREEN results are sufficient: archived RED logs, a matrix, and controller release records are unnecessary. Report a disclosed test-first omission honestly. Missing historical RED logs alone do not block acceptance; missing, stale, ambiguous, or failing evidence for a required current check does. Never ask for working code to be disabled to manufacture test history. Treat warnings and other noise in reported test output as findings. If evidence is truncated or missing, reread its stated report path and report a genuine evidence gap rather than rerunning the suite.

### Spec compliance

Compare the diff with the requirements and identify missing, extra, or misunderstood behavior. For batched assignments, check every listed file: each required file must have its corresponding diff hunk. A criterion that cannot be verified from this diff is an explicit `UNVERIFIED` item with the controller check needed; do not broaden the review to resolve it.

### Quality

Assess correctness, repository standards, maintainability, error handling, regressions, and behavioral tests. Check separation of concerns, appropriate abstraction, edge cases, unit responsibilities, and whether the plan's file structure was followed. Flag new or changed file size only when this change caused the growth. Cite evidence with file:line references for every finding and every affirmative quality claim.

Calibrate severity by actual impact. Important findings are defects, missed requirements, fragile behavior, or maintainability damage that block trust. Broader-than-needed coverage and polish are Minor. A plan-mandated defect (such as a test that asserts nothing) is Important and labeled plan-mandated. Acknowledge specific strengths before issues. Report findings without initiating fixes or changing the controller's round budget.

Save the report at [REPORT_PATH] using this format:

### Spec Compliance
- **Spec: PASS | FAIL | UNVERIFIED.** Map each criterion to diff evidence; identify missing, extra, or misunderstood behavior.
- **UNVERIFIED:** [requirements not verifiable from the diff and what the controller should check, or None]

### Quality
- **Quality: PASS | FAIL | UNVERIFIED.** Assess correctness, standards, maintainability, error handling, regressions, and behavioral tests with evidence.

### Strengths
Specific strengths with evidence.

### Issues

#### Critical (Must Fix)
#### Important (Should Fix)
#### Minor (Nice to Have)

For each issue provide stable identifier, severity/impact, file:line, evidence, required correction, and whether it blocks. Write “None” for empty categories.

### Checks
Commands/results inspected or run, the snapshot covered, and limitations; distinguish reviewer-run from implementer-reported evidence.

### Assessment
**Task quality:** [Approved | Needs fixes]
**Reasoning:** [1-2 technical sentences. Approve only when Spec and Quality are PASS and no blocking finding remains.]

Return the report itself, beginning directly with the Spec Compliance verdict. Do not add a preamble, process narration, or closing summary.
````
