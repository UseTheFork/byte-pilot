Reporter: unknown
Category: enhancement

# 08: Stack-aware `setup-project`

**What to build:** The installed `setup-project` skill and its templates render differently per selected stack (just recipes and tooling docs for PHP/Laravel, Python and TypeScript). The skill states explicitly that an agent following it writes the `justfile` and `docs/agents/*`, and that spindle itself writes only inside `.github`.

**Blocked by:** 04, 07

**Status:** ready-for-agent
**Execution:** pending

- [ ] Rendering with each single stack yields stack-appropriate just recipes and tooling docs
- [ ] Rendering with several stacks combines their content
- [ ] The installed skill explicitly says an agent writes the `justfile` and `docs/agents/*`
- [ ] A test asserts spindle writes nothing outside `.github`
- [ ] Tests at the CLI seam cover each stack and a multi-stack case

Checklist key: `- [ ]` Not started; `- [X]` Complete; `- [-]` In progress; `- [S]` Skipped.

## Comments
