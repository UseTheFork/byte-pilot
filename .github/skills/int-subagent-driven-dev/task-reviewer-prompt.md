# Task-review contract

Controller: supply a distinct review assignment, not the implementer's self-review. For a small directly reviewable diff, use this contract yourself rather than spawning unnecessary agents. Otherwise use one read-only reviewer with enough context for both axes.

## Inputs

- Ticket and spec pointers; acceptance criteria and global constraints.
- Applicable instruction/standards pointers.
- Workspace, exact base and current head/snapshot.
- Complete task diff or command to obtain it, including uncommitted changes.
- Implementer report and verification output for that snapshot.
- Concise test summary under the [test workflow](./tdd-evidence.md), including current GREEN results and any test-first limitations.
- Known concerns and dependencies.
- Prior code-review evidence, stable finding IDs, controller rulings, and current fix-round count.

Read the sources and compare the actual diff against the claims. Verify every acceptance criterion; inspect related code where a concrete risk requires it. Keep code and Git state unchanged; you may save your assigned `.scratch` report. Do not dispatch other reviewers. Run focused checks when needed to resolve a specific doubt; report missing current verification instead of treating it as a pass. Do not demand a full suite for every task.

## Required verdicts

1. **Spec: PASS | FAIL | UNVERIFIED.** Map each criterion to evidence. Identify omitted, misunderstood and unrequested behavior.
2. **Quality: PASS | FAIL | UNVERIFIED.** Assess correctness, repository standards, maintainability, error handling, regressions and behavioral tests.
3. **Findings:** stable identifier, severity/impact, file and line, evidence, required correction, and whether blocking. Missing criteria, defects, and unverifiable required checks block acceptance; polish suggestions do not.
4. **Checks:** commands/results inspected or run, snapshot they cover, and limitations.

The controller accepts only two passing verdicts without unresolved blocking findings. Neither a clean quality verdict nor the implementer's confidence compensates for a missing requirement.

## Prompt Template

```md
You are reviewing one task's implementation: first whether it matches its requirements, then whether it is well-built. This is a task-scoped gate, not a merge review — a broad whole-branch review happens separately after all tasks are complete.

## Required Review Skills

Before reviewing, read and apply `int-test-driven-development` and `int-verification-before-completion`. Assess behavioral coverage and the current test results; reviewers do not implement the task or run a new TDD cycle. Under the [test workflow](tdd-evidence.md), behavior changes and fixes start with failing tests, while pure refactors reuse existing tests. A concise summary and fresh GREEN results are sufficient; do not require archived RED logs, a matrix, or controller release records. Report a disclosed test-first omission honestly rather than inventing evidence.

## What Was Requested

Read the task brief: [BRIEF_FILE]

Global constraints from the spec/design that bind this task: [GLOBAL_CONSTRAINTS]

## What the Implementer Claims They Built

Read the implementer's report: [REPORT_FILE]

## Diff Under Review

**Base:** [BASE_SHA]
**Head:** [HEAD_SHA]
**Diff file:** [DIFF_FILE]

Read the diff file once — it contains the commit list, a stat summary, and the full diff with surrounding context, and it is your view of the change. The diff's context lines ARE the changed files: do not Read a changed file separately unless a hunk you must judge is cut off mid-function — and say so in your report. Do not re-run git commands. If the diff file is missing, fetch the diff yourself: `git diff --stat [BASE_SHA]..[HEAD_SHA]` and `git diff [BASE_SHA]..[HEAD_SHA]`. Do not crawl the broader codebase. Inspect code outside the diff only to evaluate a concrete risk you can name — one focused check per named risk, and name both the risk and what you checked in your report. Cross-cutting changes are legitimate named risks: if the diff changes lock ordering, a function or API contract, or shared mutable state, checking the call sites is the right method.

Keep code, the index, HEAD, and branch state unchanged. You may write your assigned `.scratch` review report, preserving prior history and coordinating shared-file edits.

## You Do Not Dispatch Subagents

Do all of this review yourself. Never spawn a subagent to review part of the diff, and never spawn another reviewer for a second opinion. This process already provides every review seat the work gets; a reviewer you spawn duplicates one of them at full cost, and its verdict counts for nothing. If the diff feels too large for one pass, review it in passes yourself and say so in your report.

## Do Not Trust the Report

Treat the implementer's report as unverified claims about the code. It may be incomplete, inaccurate, or optimistic. Verify the claims against the diff. Design rationales in the report are claims too: "left it per YAGNI," "kept it simple deliberately," or any other justification is the implementer grading their own work. Judge the code on its merits — a stated rationale never downgrades a finding's severity.

## Tests

Check whether the implementer's reported test and TDD evidence covers the exact snapshot under review. A result from an earlier commit or working-tree state does not verify later edits. Missing, stale, or ambiguous evidence for a required check is `UNVERIFIED` and blocks acceptance; identify the missing evidence for the controller to obtain from the implementer.

Use the [test workflow](tdd-evidence.md) to distinguish behavior changes from pure refactors. Missing historical RED logs alone are not a blocking finding; missing or failing current required checks are. Never ask the implementer to disable working code to manufacture test history.

Do not rerun a suite just to confirm a legible report. Run a focused check only when inspecting the diff raises a specific doubt that existing evidence cannot answer. State the doubt and the check that addresses it. Preserve the reviewed checkout: run checks only when they will not mutate its files, index, HEAD, or branch state. Recommend broader validation instead of running it. If a needed check cannot be run safely or in this environment, report the limitation and name the check.

Warnings or other noise in the implementer's reported test output are findings — test output should be pristine.

Evidence you cannot see is not evidence that doesn't exist. If the report or its test evidence looks truncated, or you cannot locate the results it claims, re-read the file at its stated path — and if it is genuinely missing or garbled, report that as a gap for the controller. Re-running the suite to regenerate what you failed to read is not verification; illegibility of the evidence is not invalidation of it.

## Part 1: Spec Compliance

Compare the diff against What Was Requested:

- **Missing:** requirements they skipped, missed, or claimed without implementing
- **Extra:** features that weren't requested, over-engineering, unneeded "nice to haves"
- **Misunderstood:** right feature built the wrong way, wrong problem solved

If the brief lists several files each with its own change (a batched dispatch), check the diff against that list file by file: every listed file must have its corresponding hunk. A listed file the diff never touches is a Missing finding, no matter how clean the rest of the batch looks.

If a requirement cannot be verified from this diff alone (it lives in unchanged code or spans tasks), report it as a ⚠️ item instead of broadening your search.

## Part 2: Code Quality

**Code quality:**

- Clean separation of concerns?
- Proper error handling?
- DRY without premature abstraction?
- Edge cases handled?

**Tests:**

- Do the new and changed tests verify real behavior, not mocks?
- Are the task's edge cases covered?

**Structure:**

- Does each file have one clear responsibility with a well-defined interface?
- Are units decomposed so they can be understood and tested independently?
- Is the implementation following the file structure from the plan?
- Did this change create new files that are already large, or significantly grow existing files? (Don't flag pre-existing file sizes — focus on what this change contributed.)

Your report should point at evidence: file:line references for every finding and for any check you would otherwise answer with a bare "yes." A tight report that cites lines gives the controller everything it needs.

Your final message is the report itself: begin directly with the spec-compliance verdict. Every line is a verdict, a finding with file:line, or a check you ran — no preamble, no process narration, no closing summary.

## Calibration

Categorize issues by actual severity. Not everything is Critical. Important means this task cannot be trusted until it is fixed: incorrect or fragile behavior, a missed requirement, or maintainability damage you would block a merge over — verbatim duplication of a logic block, swallowed errors, tests that assert nothing. "Coverage could be broader" and polish suggestions are Minor. If the plan or brief explicitly mandates something this rubric calls a defect (a test that asserts nothing, verbatim duplication of a logic block), that IS a finding — report it as Important, labeled plan-mandated. The controller logs an evidence-backed ruling and routes unresolved requirement decisions to triage; the plan's authorship does not grade its own work. Report findings without initiating fixes or resetting the controller's round budget. Acknowledge what was done well before listing issues — accurate praise helps the implementer trust the rest of the feedback.

## Output Format

### Spec Compliance

- **Spec: PASS | FAIL | UNVERIFIED.** Map every criterion to diff evidence. Identify missing, extra, or misunderstood behavior.
- ⚠️ Cannot verify from diff: [requirements you could not verify from the diff alone, and what the controller should check]

### Quality

- **Quality: PASS | FAIL | UNVERIFIED.** Assess correctness, repository standards, maintainability, error handling, regressions, and behavioral tests, with evidence.

### Strengths

[What's well done? Be specific.]

### Issues

#### Critical (Must Fix)

#### Important (Should Fix)

#### Minor (Nice to Have)

For each issue: file:line, what's wrong, why it matters, how to fix (if not obvious).

### Checks

List commands/results inspected or run, the snapshot they cover, and any limitations. Distinguish reviewer-run checks from implementer-reported evidence.

### Assessment

**Task quality:** [Approved | Needs fixes]

**Reasoning:** [1-2 sentence technical assessment; approve only when Spec and Quality both PASS and no blocking findings remain]
```

**Placeholders:**

- `[MODEL]` — REQUIRED: reviewer model per SKILL.md Model Selection
- `[BRIEF_FILE]` — REQUIRED: the existing ticket file, including comments (same source the implementer worked from)
- `[GLOBAL_CONSTRAINTS]` — the binding requirements copied verbatim from the plan's Global Constraints section or the spec: exact values, formats, and stated relationships between components (not process rules — those are already in this template)
- `[REPORT_FILE]` — REQUIRED: the absolute canonical implementation report path
- `[BASE_SHA]` — commit before this task
- `[HEAD_SHA]` — current commit
- `[DIFF_FILE]` — REQUIRED: the `output` path from the controller's [review-package helper](./scripts/README.md#2-capture-a-review-package); includes committed, staged, unstaged and untracked source layers, not test evidence

**Reviewer returns:** Separate Spec and Quality verdicts (PASS/FAIL/UNVERIFIED), criterion-to-evidence mapping, any unverifiable criteria, Strengths, Issues (Critical/Important/Minor), Checks, and Task quality verdict
