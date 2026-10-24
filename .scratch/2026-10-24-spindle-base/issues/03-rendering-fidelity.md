Reporter: unknown
Category: enhancement

# 03: Rendering fidelity

**What to build:** Stubs render through Nunjucks with custom delimiters so variables are substituted while existing `{{VSCODE_...}}` placeholders stay literally intact. Sub-files of a skill (such as a `templates/` folder) install with it; text files render and non-text files are copied byte for byte.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] Output delimiters are `<%= %>` and tags are `<% %>`; variables substitute in text files
- [ ] `{{VSCODE_...}}` text is preserved unchanged in installed skills
- [ ] Sub-files install alongside their skill, including nested directories
- [ ] Non-text files are copied byte for byte
- [ ] Tests at the CLI seam cover each of the above

Checklist key: `- [ ]` Not started; `- [X]` Complete; `- [-]` In progress; `- [S]` Skipped.

## Comments
