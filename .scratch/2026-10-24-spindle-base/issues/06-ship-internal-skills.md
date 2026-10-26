Reporter: unknown
Category: enhancement

# 06: Ship the internal skills

**What to build:** All `int-*` skills become versioned stubs shipped with spindle. A default install reproduces their current text, and each installed `SKILL.md` carries a valid semver `version`.

**Blocked by:** 03

**Status:** ready-for-agent
**Execution:** integrated

- [X] Every current `int-*` skill, with its sub-files, is a stub
- [X] Each stub's `SKILL.md` frontmatter has a semver `version`
- [X] A default `init` installs them all and their content matches the current skills
- [X] A test asserts every shipped skill has a valid semver `version`

Checklist key: `- [ ]` Not started; `- [X]` Complete; `- [-]` In progress; `- [S]` Skipped.

## Comments
