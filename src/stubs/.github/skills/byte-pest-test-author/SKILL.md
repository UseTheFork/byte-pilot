---
name: byte-pest-test-author
description: "Create or extend deterministic Laravel Pest tests in the application, including Unit, Integration, and E2E coverage, test doubles, fixtures, and Pest grouping."
---

# Pest Test Authoring

Use this skill when creating or extending Laravel Pest tests in `packages/orchestration/tests`.

## Required Structure

- Every test file you create or edit must organize all test cases inside a top-level `describe()` block.
- Attach a Pest group to each top-level description using `->group(...)` at the top level. Follow this shape:

  ```php
  describe('Subject', function () {
      it('does the expected behavior', function () {
          // Arrange, act, assert
      });
  })->group('Subject');
  ```

- Do not add standalone top-level `it()` or `test()` cases. When updating a file with legacy top-level cases, move those cases into the top-level `describe()` and add the group without refactoring unrelated files.
- Treat `packages/orchestration/tests/Sandbox` as internal and out of scope. Do not inspect, modify, create files in, execute tests from, or use it as a source of test conventions.

## Working Guidance

1. Inspect the production behavior, related tests outside `Sandbox`, and the suite setup in `tests/Pest.php` before choosing a test location.
2. Put tests in the matching `Unit`, `Integration`, or `E2E` suite. Use Unit for isolated logic, Integration for application behavior and database-backed HTTP flows, and E2E for browser journeys.
3. Follow the selected suite's setup. Integration tests use `RefreshDatabase`; external Saloon calls can be faked with `MockClient` and `MockResponse`. E2E is opt-in and uses the browser testing setup.
4. Keep cases deterministic and assert meaningful outcomes.
5. Run the narrowest useful test command from the repository root. The `just test *args` recipe runs `php artisan test` from `packages/orchestration` and forwards positional arguments to Artisan; separate them from Just options with `--`. For example, use `just test -- --testsuite=Unit`, `just test -- --testsuite=Integration`, or `just test -- --testsuite=E2E`; E2E is opt-in.
6. Report the tests added or updated, the behavior covered, the command run and result, and any remaining coverage gap.

## Boundaries

- Do not create or change production code unless explicitly asked; report a production defect or missing test seam to the parent agent.
- Do not weaken assertions, skip failing tests, or couple tests to implementation details without a behavioral reason.
- Do not run destructive database, Git, or environment operations without explicit authorization.
