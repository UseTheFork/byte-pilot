Reporter: unknown
Category: enhancement

# 10: `spindle update`

**What to build:** `update` reads the `version` from each installed skill's `SKILL.md` and compares it to the stub's version. For each skill whose stub version is strictly newer it asks overwrite or skip (with a flag policy for non-interactive runs), then re-renders using the stacks and variables stored in `spindle.json`.

**Blocked by:** 04, 06

**Status:** ready-for-agent

- [ ] Only a strictly greater stub version counts as outdated; equal or lower versions are left alone
- [ ] A missing or non-semver installed version is skipped with a warning
- [ ] Skills not on disk are ignored and never installed
- [ ] Overwriting re-renders with the stored stacks and variables
- [ ] A flag sets the overwrite-or-skip policy for non-interactive runs
- [ ] Editing `spindle.json` and running `update` picks up the changed stacks and variables
- [ ] Tests at the CLI seam cover each of the above

Checklist key: `- [ ]` Not started; `- [X]` Complete; `- [-]` In progress; `- [S]` Skipped.

## Comments
