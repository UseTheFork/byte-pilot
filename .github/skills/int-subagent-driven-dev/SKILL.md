---
name: int-subagent-driven-dev
description: "Use when an explicitly assigned ticket or full spec needs a controller to coordinate implementation, reviews, fixes, and verification."
user-invocable: false
---

# Subagent-Driven Development

Deliver the assigned ticket or complete dependency graph with implementation, review, fixes, and verified hand-back. The brief and acceptance criteria are authoritative. The controller owns dispatch, tracker updates, review decisions, and final reporting.

**REQUIRED SKILLS:** `int-test-driven-development` for implementation, `int-verification-before-completion` for claims, and `int-retrospective` after standalone delivery.

## Workspace and tracker

Work in the existing checkout. **Never create or use a Git worktree or another checkout.** Dispatch tickets sequentially; agents share the current source tree, so only one agent may edit code at a time. Freeze code changes while a reviewer examines it.

Keep issue files, comments, plans, and durable reports in the canonical `.scratch/YYYY-MM-DD-<feature-slug>/` directory. Agents may update assigned `.scratch` files and save their reports directly. Coordinate file ownership to avoid concurrent edits; the controller still owns execution states and acceptance decisions. Preserve existing user edits and report history.

## Resume

Before dispatch, read the ticket's comments and session ledger. Restore the current checkout and code snapshot, dependency states, test status, findings and rulings, and fix-round counters. Resume at the recorded gate without resetting budgets. Rerun relevant tests when current results are missing or stale; report failures and checks that cannot run.

## Workflow

1. **Pre-flight.** Read the spec, assigned tickets and comments, applicable instructions, glossary and ADRs. Map each criterion to observable outcomes and confirmed test seams. Validate dependencies and graph acyclicity; route unclear or conflicting requirements to triage. Require tracker guidance, record the existing checkout and dated `.scratch` feature directory, preserve its current changes, and confirm the starting revision and permissions. Check that the working tree is usable and required baseline checks pass. Select a ticket only when every dependency is `Execution: integrated`.

   Resolve durable report paths before dispatch:

   ```sh
   just sdd::workspace --workspace /absolute/checkout \
     --reports-dir .scratch/2026-10-23-feature/reports --ticket 03
   ```

   **Complete when:** the assignment, dependencies, test seams, current checkout, `.scratch` paths, baseline, permissions, and finalization owner are recorded; otherwise report or route the blocker.

2. **Implement one ticket.** Set `Execution: claimed`, then `implementing`. Dispatch one implementer with [the implementer contract](implementer-prompt.md), canonical source pointers, allowed code/test and `.scratch` files, report path, checks, permissions, and any dependency evidence. Workers use the existing checkout and never dispatch other agents.

   Follow [the test workflow](tdd-evidence.md) once for the ticket: write covering tests for its acceptance criteria, verify RED, implement the whole ticket, then run relevant tests and regression checks to establish GREEN. Do not require per-behavior cycles or controller checkpoints; intermediate test runs are optional. Pure refactors reuse existing tests. Save a concise report with the tested snapshot, changed files, criteria, commands/results, and limitations. No evidence matrix or archived RED output is required.

   **Complete when:** the report identifies the current code, relevant tests pass after the final edit, and any limitations are explicit.

3. **Review and fix.** Freeze code changes. Dispatch a fresh code reviewer using [the code-review contract](code-reviewer-prompt.md), then complete the separate Spec and Quality task review using [the task-review contract](task-reviewer-prompt.md). The controller may review a small diff directly. Reviewers inspect code without editing it and may save their assigned `.scratch` reports; they do not change execution states or run other reviewers.

   Share **at most five corrective implementer dispatches per ticket** across code review, task review, and integration fixes. Persist the round before dispatch; resumes and new findings do not reset it. Require fresh covering-test evidence and one [scoped re-review](re-review-prompt.md) for each fix dispatch. At round five, adjudicate every residual finding; never dispatch round six. Load-bearing findings or missing required evidence keep the ticket incomplete. Resolve requirement conflicts through triage and record every declined-behavior ruling.

   **Complete when:** code review and Spec/Quality pass on the current snapshot, all findings have rulings, and no load-bearing finding remains.

4. **Verify and advance.** Run fresh relevant checks on the accepted snapshot. Since work remains in the existing checkout, integration is verification—not branch or patch transfer. Set `Execution: integrated` only after current checks pass and the ticket's review evidence matches the current code. Recompute the dependency frontier and repeat steps 2–4 sequentially. A ticket-scoped caller-owned assignment returns its accepted snapshot and evidence to the caller instead of taking ownership of later delivery steps.

   Before dispatching the next ticket, make a controller-owned checkpoint commit when it provides a useful recovery point and the accepted ticket changes can be isolated cleanly. This workflow authorizes interim commits by the controller; stage only that ticket's accepted changes, preserve caller edits, and record the commit ID with its evidence. If the changes cannot be isolated safely, defer the commit and report why. Implementers remain bound by their own commit permissions.

   **Complete when:** the ticket is recorded as integrated on the current checkout with matching review and verification evidence, or the blocker and retained work are explicit.

5. **Finalize a full-spec delivery.** After every assigned ticket is integrated, run one fresh aggregate code review of the full delivery using the code-review contract. Permit one final-fix dispatch and one scoped re-review total; preserve unresolved findings and report incomplete hand-back if any load-bearing issue remains. Run fresh final verification under `int-verification-before-completion`. Invoke `int-retrospective` once for the full delivery, with the ledger, review history, checks, and parked findings.

   **Complete when:** aggregate review, any permitted fix, final verification, and retrospective are recorded for the current snapshot; otherwise report the exact unfinished gate.

6. **Hand back.** Report the code snapshot, criterion-to-evidence mapping, review verdicts and findings, commands/results, `.scratch` report paths, ticket states, retrospective pointer, and limitations. Do not commit, push, publish, close tickets, or delete user work without authorization.

   **Complete when:** the caller or user has the reports and evidence pointers, and every unfinished or blocked item is explicit.

## Common mistakes

- Starting dependent work before every prerequisite is integrated in the current checkout.
- Letting two agents edit the shared source tree at once or changing code during review.
- Treating a passing test, worker status, or old review as acceptance of a later snapshot.
- Overwriting another agent's `.scratch` edits or discarding report history or user changes.
- Claiming completion with failed or missing current verification or an unresolved load-bearing finding.

For an example of the sequential shared-checkout workflow, see [example-workflow.md](example-workflow.md).
