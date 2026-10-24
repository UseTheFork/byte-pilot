Reporter: unknown
Category: enhancement

# 07: Ship the workflow skills

**What to build:** The remaining skills (such as `setup-project`, `to-spec`, `to-tickets` and every other non-`int-*` skill) become versioned stubs that use the approved variables. A default install reproduces their current text.

**Blocked by:** 03, 05, 06

**Status:** ready-for-agent

- [ ] Every remaining current skill, with its sub-files, is a stub
- [ ] Each has a semver `version` in its `SKILL.md` frontmatter
- [ ] The approved variables replace the hard-coded project-specific values
- [ ] A default `init` installs every shipped skill and content matches the current skills
- [ ] The version-validity test from the internal-skills ticket covers these skills too

Checklist key: `- [ ]` Not started; `- [X]` Complete; `- [-]` In progress; `- [S]` Skipped.

## Comments
