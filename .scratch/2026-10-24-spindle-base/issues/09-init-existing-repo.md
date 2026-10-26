Reporter: unknown
Category: enhancement

# 09: `init` on an existing repo

**What to build:** Running `init` in a repo that already has a config stops and points the user to `update`. If skill directories exist but there is no config, `init` asks overwrite or skip for each one, with a flag policy so it also works non-interactively.

**Blocked by:** 04, 06

**Status:** ready-for-agent
**Execution:** integrated

- [X] With an existing `spindle.json`, `init` exits non-zero, changes nothing and points to `update`
- [X] With existing skill directories and no config, each one is prompted overwrite or skip
- [X] A flag sets the overwrite-or-skip policy for non-interactive runs
- [X] Skipped skills are left untouched; overwritten skills are re-rendered
- [X] Tests at the CLI seam cover each of the above

Checklist key: `- [ ]` Not started; `- [X]` Complete; `- [-]` In progress; `- [S]` Skipped.

## Comments
