# Scoped fix-review contract

Controller: use once per corrective dispatch after code, task, or final aggregate review. This verifies fixes; it does not restart the whole review. The controller owns the five-round task budget, one-dispatch final budget, and residual adjudication; a reviewer never starts another fix round. Supply:

- Original task/spec and standards pointers.
- Prior Spec/Quality verdicts and every open finding with its identifier.
- Previous reviewed snapshot and current fixed snapshot.
- Fix-only diff between those snapshots, including uncommitted changes.
- Updated implementer report with fresh covering-test output for the fixed snapshot.
- Concise test summary under the [test workflow](./tdd-evidence.md); preserve prior results for unaffected behavior.
- Review phase, fix-round number/budget, prior code-review verdict when applicable, and controller rulings.

Check each previous finding against the code, then inspect the fix diff for regressions it introduced. Use unchanged context only to resolve a concrete risk. Preserve earlier verified evidence for unaffected behavior. If the fix changes acceptance criteria or broader contracts, report the impact and request the necessary expanded review explicitly.

Return this complete record:

| Finding                            | Verdict                                | Evidence                                         |
| ---------------------------------- | -------------------------------------- | ------------------------------------------------ |
| F1: required owner became nullable | ADDRESSED / NOT ADDRESSED / UNVERIFIED | Relevant code and current covering-test evidence |

Include every supplied finding, not just the example. Separately list:

- **Fix-induced regressions:** impact, file/line and blocking decision, or none.
- **Out-of-scope observations:** unrelated issues for the final review ledger; they do not extend this fix loop.
- **Spec and Quality:** updated separate verdicts, including missing evidence.
- **Checks and snapshot:** commands/results inspected or run, and limitations.

A claimed fix without current required evidence remains unverified. Return open findings to the controller for another permitted round or breaker adjudication, not an automatic implementer redispatch. Code review is read-only; you may save your assigned `.scratch` report. The controller owns dispatch and acceptance.

## Prompt Template

```md
You are re-reviewing one task's fix round. A previous review produced findings; an implementer has attempted to fix them. Your job is to verdict each finding and inspect the fix diff — nothing else.

## Required Review Skills

Before reviewing, read and apply `int-test-driven-development` and `int-verification-before-completion`. Assess whether covering tests verify the fix at an appropriate boundary and pass on the current code. Follow the [test workflow](tdd-evidence.md): fixes start with failing tests; pure refactors reuse existing tests. A concise summary and fresh GREEN results are sufficient; do not require archived RED logs, a matrix, or controller release records. Reviewers do not implement fixes or run a new TDD cycle.

## The Task

Read the task brief: [BRIEF_FILE]

## The Findings Under Verification

[FINDINGS]

**Phase and round:** [REVIEW_PHASE_AND_ROUND]
**Prior verdicts and controller rulings:** [PRIOR_VERDICTS_AND_RULINGS]

Preserve unaffected evidence and update the code-review verdict when that gate supplied findings. Still return separate Spec and Quality verdicts. If initial task review has not happened, say so; a scoped code-fix review cannot stand in for the initial full task review.

## The Fix

Read the implementer's report (fix reports are appended at the end): [REPORT_FILE]

**Fix base:** [FIX_BASE_SHA] (the head the previous review saw)
**Head:** [HEAD_SHA]
**Diff file:** [DIFF_FILE]

Read the diff file once — it contains the fix commits, a stat summary, and the fix diff with surrounding context. Do not re-run git commands. If the diff file is missing, fetch the diff yourself: `git diff --stat [FIX_BASE_SHA]..[HEAD_SHA]` and `git diff [FIX_BASE_SHA]..[HEAD_SHA]`.

Keep code, the index, HEAD, and branch state unchanged. You may write your assigned `.scratch` review report, preserving prior history and coordinating shared-file edits.

## You Do Not Dispatch Subagents

Do all of this review yourself. Never spawn a subagent to review part of the diff, and never spawn another reviewer for a second opinion. This process already provides every review seat the work gets; a reviewer you spawn duplicates one of them at full cost, and its verdict counts for nothing. If the diff feels too large for one pass, review it in passes yourself and say so in your report.

## Scope

Your scope is the findings list and the fix diff. Verdict every finding. Inspect the fix diff for new problems the fix itself introduced. Do NOT re-review code the fix did not touch: if you notice an issue entirely outside the fix diff, report it under Out-of-Scope Observations — it does not block this task and does not extend the loop. A broad whole-branch review happens after all tasks are complete.

Unchanged code may be inspected only to resolve a concrete fix-induced risk. For example, if the fix changes a shared API contract, inspect the affected call sites needed to assess compatibility and name that risk in the report. If the impact cannot be bounded to this finding and its fix, request expanded review rather than silently widening this round.

## Tests

Check that the fix report names the covering tests and shows their output for the exact fixed snapshot. Treat those results as claims to assess against the diff. Evidence from before a later edit is stale; missing, stale, or ambiguous required evidence makes that finding `UNVERIFIED` and keeps it open. Request current evidence from the controller/implementer rather than rerunning the suite to recreate it.

Run a focused check only when the diff raises a specific doubt that the reported evidence cannot answer. State the doubt and check. Preserve the read-only checkout: run checks only when they cannot mutate files, index, HEAD, or branch state. Recommend broader validation instead of running it. If a required check cannot be run safely, report the limitation and name it.

## Output Format

Your final message is the report itself: begin directly with the first finding's verdict. Every line is a verdict, a finding with file:line, or a check you ran — no preamble, no process narration.

### Finding Verdicts

For each finding in The Findings Under Verification, in order:

- **[finding one-liner]** — ADDRESSED | NOT ADDRESSED, with file:line evidence, or UNVERIFIED when the code or required evidence cannot establish the result. "Attempted" is not addressed: the specific defect must no longer exist. Keep NOT ADDRESSED and UNVERIFIED findings open.

### New Breakage in the Fix Diff

Anything the fix itself broke or introduced, with severity (Critical/Important/Minor) and file:line. "None" if clean.

### Updated Spec and Quality

- **Spec:** PASS | FAIL | UNVERIFIED, with each prior criterion/finding mapped to fix-diff evidence.
- **Code review:** updated readiness for affected findings, or not applicable; preserve unaffected evidence and identify any pending initial task review.
- **Quality:** PASS | FAIL | UNVERIFIED, including fix-induced regressions and required test evidence.
- If the fix changes acceptance criteria or a broader contract, identify the impact and request expanded review; do not imply that this scoped round accepted the expanded behavior.

### Out-of-Scope Observations

Issues you noticed entirely outside the fix diff. Non-blocking; the controller ledgers these for the final review. "None" if none.

### Verdict

**Fix round:** [All findings addressed, no new Critical/Important breakage | Findings remain open] — list all NOT ADDRESSED and UNVERIFIED findings. Report the round as complete only when each supplied finding is ADDRESSED, no new Critical/Important breakage remains, and Spec and Quality both PASS for the scoped fix.

### Checks and Snapshot

State the exact fixed snapshot (SHA or working-tree/diff identity), the implementer-reported commands and results inspected, any reviewer-run checks and their results, and limitations. Distinguish reported evidence from checks you ran.
```

**Placeholders:**

- `[BRIEF_FILE]` — the task brief file (same file the implementer worked from)
- `[FINDINGS]` — the Critical/Important findings and spec gaps from the previous review, copied verbatim, one per bullet
- `[REVIEW_PHASE_AND_ROUND]` — code/task/final phase and controller's persisted fix-round count
- `[PRIOR_VERDICTS_AND_RULINGS]` — previous verdicts and evidence-backed controller decisions
- `[REPORT_FILE]` — the absolute canonical implementation report with appended fix results
- `[FIX_BASE_SHA]` — the head the previous review saw
- `[HEAD_SHA]` — current commit
- `[DIFF_FILE]` — the fix-only package path prepared using the [review-package recipe](./scripts/README.md#2-capture-a-review-package), including its limitation for a previously reviewed dirty snapshot

**Re-reviewer returns:** per-finding verdicts (ADDRESSED / NOT ADDRESSED / UNVERIFIED), fix-induced breakage, out-of-scope observations, updated Spec and Quality verdicts, checks and snapshot, and a round verdict.
