Reporter: unknown
Category: enhancement

# 02: `just` prerequisite check

**What to build:** Every spindle command first verifies that `just` is installed. If it is missing the command exits with a clear error and an install link, before doing anything else. spindle never installs `just`.

**Blocked by:** 01

**Status:** ready-for-agent
**Execution:** integrated

- [X] Every command checks for `just` before any other step
- [X] A missing `just` produces a non-zero exit, an error message and an install link
- [X] Nothing is written to disk when `just` is missing
- [X] A test runs the CLI with a `PATH` that excludes `just` and asserts the above

Checklist key: `- [ ]` Not started; `- [X]` Complete; `- [-]` In progress; `- [S]` Skipped.

## Comments
