Reporter: unknown
Category: enhancement

# 01: Walking skeleton: non-interactive `init`

**What to build:** A maintainer runs `spindle init` with flags in a project and gets one placeholder skill installed under `.github/skills/` with a `version` in its `SKILL.md` frontmatter, plus a `.github/spindle.json` config recording the chosen stack. The `spindle` binary is runnable, the existing `byte` binary name is replaced by `spindle`, and a process-level test harness runs the real CLI against temporary project directories.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent
**Execution:** integrated

- [X] The package exposes a `spindle` binary and no `byte` binary
- [X] `init` accepts a stack flag and writes `.github/spindle.json` with `stacks` and `variables`
- [X] The placeholder stub renders into `.github/skills/<name>/SKILL.md` with a semver `version`
- [X] Exit code is 0 on success and non-zero on failure
- [X] A test runs the real CLI as a subprocess in a temp directory and asserts exit code, installed skill and config contents

Checklist key: `- [ ]` Not started; `- [X]` Complete; `- [-]` In progress; `- [S]` Skipped.

## Comments
