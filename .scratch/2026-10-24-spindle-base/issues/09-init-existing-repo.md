Reporter: unknown
Category: enhancement

# 09: `init` on an existing repo

**What to build:** Running `init` in a repo that already has a config stops and points the user to `update`. If skill directories exist but there is no config, `init` asks overwrite or skip for each one, with a flag policy so it also works non-interactively.

**Blocked by:** 04, 06

**Status:** ready-for-agent

- [ ] With an existing `spindle.json`, `init` exits non-zero, changes nothing and points to `update`
- [ ] With existing skill directories and no config, each one is prompted overwrite or skip
- [ ] A flag sets the overwrite-or-skip policy for non-interactive runs
- [ ] Skipped skills are left untouched; overwritten skills are re-rendered
- [ ] Tests at the CLI seam cover each of the above

Checklist key: `- [ ]` Not started; `- [X]` Complete; `- [-]` In progress; `- [S]` Skipped.

## Comments
