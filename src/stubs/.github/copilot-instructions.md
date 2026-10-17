# Mandatory Project Guidance

<EXTREMELY-IMPORTANT>
Before starting ANY task, you MUST read and consider the [Project Constitution](./instructions/constitution.instructions.md).
This includes questions, research, planning, implementation, reviews, and tooling changes.

Apply its relevant rules throughout the task. Apply technology-specific rules only where appropriate. If the constitution cannot be read, report the blocker before proceeding.

When delegating, require each subagent to read the constitution before starting its task.
</EXTREMELY-IMPORTANT>

# Project Commands

**JUST automatically picks the correct directory to run these commands from**

- Linting
  - `just lint-frontend *args` - proxies to pnpm `pnpm lint:fix *args`
  - `just lint-backend *args` - proxies to pnpm `mago lint *args`
- Formatting:
  - `just format-frontend *args` - proxies to `pnpm oxfmt *args`
  - `just format-backend *args` - proxies to `mago format *args`
- Type checking:
  - `just check-types-frontend` - proxies to `pnpm check-types`
  - `just check-types-backend` - proxies to `./vendor/bin/pest --type-coverage`
- Testing:
  - `just test *args`- proxies to `php artisan test *args`
- Tooling:
  - `just artisan *args`- proxies to `php artisan *args`
  - `just pnpm *args`- proxies to `pnpm *args`

## Testing

- Focused tests: `just test --filter=<test-name>`
- Unit tests: `just test --testsuite=Unit`
- Integration tests: `just test --testsuite=Integration`
- E2E tests, when required: `just test --testsuite=E2E`
