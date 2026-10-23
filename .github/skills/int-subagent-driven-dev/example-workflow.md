# Example: sequential tickets in one checkout

The [workflow](./SKILL.md) is authoritative. This example shows a two-ticket dependency graph using the existing checkout and canonical `.scratch` feature directory.

## Pre-flight

The controller reads the spec, ticket comments, repository instructions, and tracker guidance. It records the current checkout, starting revision, user changes, permissions, dependency graph, and `.scratch/2026-10-23-dataset-foundation/` as the canonical feature directory. Ticket 2 depends on ticket 1, so only ticket 1 is initially ready.

The controller resolves report destinations:

```sh
just sdd::workspace --workspace /repo \
  --reports-dir .scratch/2026-10-23-dataset-foundation/reports --ticket 01
```

## Ticket 1

1. Set `Execution: claimed`, then dispatch one implementer and set `implementing`. The worker edits assigned code/tests in `/repo` and may update assigned `.scratch` files.
2. The implementer starts each behavior change with a failing test and implements until it passes, continuing through the ticket without a checkpoint pause or evidence matrix. After final relevant tests pass, it saves a concise implementation report directly under `.scratch`.
3. Freeze code changes. A fresh code reviewer checks the current diff. The controller then completes separate Spec and Quality task review. Reviewers may save assigned reports under `.scratch` but do not edit code or spawn agents.
4. If a blocking finding remains, spend one of the task's five shared fix dispatches, capture fresh covering tests, and run one scoped re-review. Otherwise, run current checks, set `Execution: integrated`, and recompute the graph.

Ticket 2 is now ready because ticket 1's accepted changes are already in the same checkout and freshly verified.

## Ticket 2 and finalization

Repeat the ticket gates sequentially for ticket 2. After all tickets are integrated, run one aggregate review of the full delivery, permit at most one final fix and scoped re-review, then perform fresh final verification. Invoke `int-retrospective` once for the full spec and report the snapshots, reports, ticket states, checks, and limitations.

No separate checkout, branch transfer, worktree cleanup, or `.scratch` copy is involved. If a blocking issue remains, preserve the checkout and reports and return an incomplete hand-back.
