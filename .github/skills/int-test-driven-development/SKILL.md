---
name: int-test-driven-development
description: "This is an internal skill do not load it unless explicitly required by the user or another skill."
user-invocable: false
---

# Test-Driven Development

TDD is the red → green loop. This skill is the reference that makes that loop produce tests worth keeping: what a good test is, where tests go, the anti-patterns, and the rules of the loop. Every section applies on every cycle: consult them before and during the loop, not after.

When exploring the codebase, read `GLOSSARY.md` (if it exists) so test names and interface vocabulary match the project's domain language, and respect ADRs in the area you're touching.

## What a good test is

Tests verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't. A good test reads like a specification: "user can checkout with valid cart" tells you exactly what capability exists, and it survives refactors because it doesn't care about internal structure.

See [tests.md](tests.md) for examples and [mocking.md](mocking.md) for mocking guidelines.

## Seams: where tests go

A **seam** is the public boundary you test at: the interface where you observe behavior without reaching inside. Tests live at seams, never against internals.

**Test only at pre-agreed seams.** Before writing any test, write down the seams under test and confirm them with the user. No test is written at an unconfirmed seam. You can't test everything, so agreeing the seams up front is how testing effort lands on the critical paths and complex logic instead of every edge case.

Ask: "What's the public interface, and which seams should we test?" Give each proposed seam a one-line note on what it catches and what it misses.

When the shape of that interface is itself in question (how deep the module is, where the seam belongs, what the interface should expose), call the Skill tool with "codebase-design" for the vocabulary. It is the shared source of the module, interface, depth, seam, adapter, leverage and locality terms, and it is a reference to consult, not a session to run.

## Anti-patterns

- **Implementation-coupled**: mocks internal collaborators, tests private methods, or verifies through a side channel (querying the database instead of using the interface). The tell: the test breaks when you refactor but behavior hasn't changed.
- **Tautological**: the assertion recomputes the expected value the way the code does (`expect(add(a, b)).toBe(a + b)`, a snapshot derived by hand the same way, a constant asserted equal to itself), so it passes by construction and can never disagree with the code. Expected values must come from an independent source of truth: a known-good literal, a worked example, the spec.
- **Criteria without coverage**: a single failing test does not necessarily cover a whole task. Map every acceptance criterion to focused behavioral tests before implementation, then run the covering set together for RED. The requirement is complete behavioral coverage, not one test per behavior or one test total.

## Task-level test-first workflow

Use one RED → implementation → GREEN sequence per assigned task.
Do not require a separate cycle for every behavior, test, or file.

1. **Define coverage.** Map the task's acceptance criteria to behavioral tests at the agreed public seams. Use enough focused tests to cover the task; one test is sufficient only when it covers the requirement.
2. **RED.** Write or update the covering tests before changing production code. Run them together and confirm the expected failures demonstrate missing behavior, not broken setup or unrelated errors. Existing behavior may already pass; do not manufacture failures.
3. **Implement the whole task.** Complete all required production changes without mandatory intermediate test runs, per-behavior checkpoints, or controller approval. Intermediate runs remain optional.
4. **GREEN.** Run the new or changed tests and the narrowest relevant regression checks against the completed implementation. Correct failures and rerun affected checks until they pass. Any later code change requires fresh relevant verification.

Do not weaken behavioral assertions merely to obtain GREEN. Report
failed or unavailable required checks explicitly.

Pure refactors reuse existing behavioral tests and require no RED phase.

## Refactoring outside the loop

Refactoring preserves observable behavior. After GREEN, or for a standalone refactor with passing tests, make the structural improvement and rerun the same relevant tests. A pure refactor requires neither new tests nor a fresh RED phase; keep existing behavioral assertions unchanged.

**Complete when:** the relevant tests pass again and the diff preserves the tested behavior. If the refactor breaks an existing test, correct the regression rather than weakening the assertion. If the intended behavior changes, treat it as a behavior-changing task and use this workflow instead of calling it a refactor.

See [tests.md](tests.md) for test examples and [mocking.md](mocking.md) for mocking guidance.
