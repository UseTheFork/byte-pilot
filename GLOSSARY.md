# Spindle

A CLI that scaffolds and maintains a project's `.github` directory from Nunjucks sources, driven by the stacks and answers the user provides.

## Language

**Stub**:
A Nunjucks source for a skill, shipped with spindle and rendered into a user's repo.
_Avoid_: Template (already used for ordinary files such as `setup-project/templates/`)

**Skill**:
A rendered directory under `.github/skills/` in the user's repo, led by a `SKILL.md` that carries a `version`.
_Avoid_: Installed stub, rendered stub

**Stack**:
An opinionated language-and-framework choice the user selects during `init`, such as PHP (Laravel), Python or TypeScript.
_Avoid_: Language, framework

**Variable**:
A named value the user supplies that stubs interpolate into skills.
_Avoid_: Setting, parameter

**Config**:
The `.github/spindle.json` file holding the user's selected stacks and variables.
_Avoid_: Settings file, manifest
