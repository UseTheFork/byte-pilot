Category: enhancement
Status: ready-for-agent
Reporter: unknown
Source design: design.md (same directory)

# Spindle base: skill scaffolding CLI

## Problem Statement

Maintainers of Copilot-enabled repositories hand-copy the same skills into every project's `.github/skills/` and have no way to tell when those copies fall behind. Skills also contain project-specific text (tooling commands, doc locations, conventions, language-specific guidance) that must be edited by hand per project. There is no record of which stacks a project uses, and no safe way to refresh skills when the shipped version improves.

## Solution

`spindle` is a CLI, requiring `just`, that installs and updates the shipped skills in a project's `.github/skills/`.

- `spindle init` asks which stacks the project uses (PHP/Laravel, Python, TypeScript; at least one), renders every skill from its stub with the user's variables, and saves the **config** in `.github/spindle.json`.
- `spindle update` compares the `version` in each installed skill's `SKILL.md` frontmatter with the stub's version and, for each outdated skill, asks whether to overwrite or skip.
- Every prompt has a flag equivalent so both commands can run non-interactively, in CI or in tests.

## User Stories

1. As a maintainer, I want to run `spindle init` in a repo, so that all shipped skills are installed without hand-copying.
2. As a maintainer, I want to be asked first which stacks my project uses, so that skills are tailored to PHP/Laravel, Python and TypeScript.
3. As a maintainer, I want to select several stacks at once, so that mixed projects (for example Laravel plus TypeScript) are supported.
4. As a maintainer, I want `init` to refuse an empty stack selection, so that the config is never meaningless.
5. As a maintainer, I want to be prompted for each variable with a sensible default, so that I only type values that differ from the norm.
6. As a maintainer, I want my stacks and variable answers saved in `.github/spindle.json`, so that they are the single source of truth for later updates.
7. As a maintainer, I want the config to hold no per-skill data, so that it stays small and hand-editable.
8. As a maintainer, I want every shipped skill, including internal `int-*` skills, installed together, so that skills that depend on each other always work.
9. As a maintainer, I want sub-files of a skill (such as its `templates/` folder) installed with the skill, so that the skill is complete.
10. As a maintainer, I want literal `{{VSCODE_...}}` placeholders preserved in output, so that skills keep working in VS Code.
11. As a maintainer, I want non-text files copied byte for byte, so that assets are not corrupted by rendering.
12. As a maintainer, I want each installed `SKILL.md` to carry a `version` in its frontmatter, so that outdated skills can be detected later.
13. As a maintainer, I want `spindle update` to detect skills whose stub version is strictly newer, so that I only touch what changed.
14. As a maintainer, I want to choose overwrite or skip for each outdated skill, so that I control which changes land.
15. As a maintainer, I want overwritten skills re-rendered with my stored stacks and variables, so that they do not revert to defaults.
16. As a maintainer, I want skills with a missing or non-semver `version` skipped with a warning, so that hand-written skills are never clobbered.
17. As a maintainer, I want `update` to ignore skills that are not on disk, so that I am not forced to adopt newly shipped skills.
18. As a maintainer, I want `init` to stop and point me to `update` when a config exists, so that I do not accidentally re-initialize.
19. As a maintainer, I want to be asked overwrite or skip for each pre-existing skill directory when no config exists, so that existing work is not silently destroyed.
20. As a maintainer, I want to change stacks or variables by editing `spindle.json` and running `update`, so that reconfiguration works before a config command exists.
21. As a maintainer, I want every command to fail first with a clear error and install link when `just` is missing, so that I know the prerequisite.
22. As a maintainer, I want spindle never to install `just` itself, so that it does not alter my system.
23. As a maintainer, I want spindle to write only inside `.github`, so that it never surprises me by editing the rest of the repo.
24. As a maintainer, I want the rendered `setup-project` skill to state that the `justfile` and `docs/agents/*` are written by an agent following it, so that the division of work is explicit.
25. As a maintainer, I want the `setup-project` skill and its templates to reflect the selected stacks, so that generated tooling instructions match my languages.
26. As a CI author, I want to pass stacks, variables and conflict policy as flags, so that `init` and `update` run without prompts.
27. As a CI author, I want a command that is missing required input in non-interactive mode to fail with a clear error rather than hang, so that pipelines never stall.
28. As a CI author, I want meaningful exit codes, so that pipelines can react to failures.
29. As a spindle developer, I want to test the CLI by running it against temporary directories with flags, so that tests assert only external behavior.
30. As a spindle maintainer, I want `package.json` to expose the `spindle` binary, so that the tool is invoked by its real name.

## Implementation Decisions

- **Terminology** follows `GLOSSARY.md`: stub, skill, stack, variable, config.
- **Commands:** `init` and `update`. The existing `validate` and `publish` scripts are not part of this spec. Command naming and exact behavior beyond what is stated here is left to the implementer.
- **Stub source:** one stub per current skill, mirroring the skill's directory including sub-files. The stub set is the current skills in the repo, all shipped.
- **Rendering:** Nunjucks with custom delimiters (`<%= %>` for output, `<% %>` for tags) so existing `{{VSCODE_...}}` text is untouched. Only text files render; others are copied verbatim.
- **Versioning:** each skill's `SKILL.md` frontmatter has a semver `version`; sub-files share it. The version is not stored in the config.
- **Config shape:** `.github/spindle.json` is `{ "stacks": [...], "variables": { "<name>": "<value>" } }`. Stack ids are `php-laravel`, `python`, `typescript`. Variable values are strings.
- **Variables:** the inventory is built by scanning the current skills for project-specific values (tooling commands, `docs/agents/*` locations, `.scratch` convention, triage labels). Each variable defaults to today's text so a default install reproduces the current skills. The inventory is reviewed with the user before implementation.
- **Stack-aware content:** stacks drive conditional content in stubs, notably the `setup-project` skill and its templates (just recipes and tooling docs).
- **Write scope:** spindle writes only inside `.github`. The rendered `setup-project` skill explicitly states that an agent writes the `justfile` and `docs/agents/*`.
- **`just` prerequisite:** every command first checks `just` is on `PATH`; if absent it exits non-zero with an error and an install link, before any other step.
- **`init` flow:** ask stacks first, then variables, then render. If a config exists, stop and point to `update`. If skill directories exist without a config, overwrite or skip per skill.
- **`update` flow:** read each installed skill's version; skip with warning when it is missing or not valid semver; treat a strictly greater stub version as outdated; per outdated skill, overwrite or skip; re-render with stored stacks and variables. Only skills already on disk are considered.
- **Non-interactive mode (user decision):** every prompt has a flag. Flags cover stack selection (repeatable), variable values, and the overwrite-or-skip policy for conflicts and outdated skills, plus a switch that disables prompting. In non-interactive mode any required input not supplied by flags or defaults is an error, never a hang. Exact flag names are left to the implementer and must be documented in the CLI help.
- **Packaging:** the `bin` entry is `spindle`.

## Testing Decisions

- **Single seam:** the CLI process boundary. Tests run the real entry point as a subprocess in a temporary project directory using flags (not scripted stdin), and assert only on exit code, messages, `.github/skills/` contents and `.github/spindle.json`.
- A good test asserts external behavior only; it does not import or inspect rendering, version-comparison or config internals.
- Cases to cover: stack validation (at least one); full render with variables substituted; `{{VSCODE_...}}` preserved; non-text files copied verbatim; config shape; `init` with existing config; `init` with existing skills and no config for both overwrite and skip; `update` with newer, equal, missing and non-semver versions; `update` overwrite and skip; overwrite using stored variables; missing required input in non-interactive mode; `just` missing via a `PATH` without it; nothing written outside `.github`.
- Interactive prompt behavior is covered by a small number of tests only if the chosen prompt library allows it at the same seam.
- Prior art: none; the repo has no source or tests yet. The test runner is chosen by the implementer.

## Out of Scope

- Stubs for agents, instructions and `copilot-instructions.md`.
- A `spindle config` command (planned later).
- Hash-based or three-way-merge update detection; edited and unedited files are not distinguished.
- Skill selection during `init`.
- Writing the `justfile`, `docs/agents/*` or any file outside `.github`.
- Installing `just`.
- The `validate` and `publish` commands.
- Stacks beyond PHP/Laravel, Python and TypeScript.

## Further Notes

- Open item: the variable inventory is pending user review before implementation.
- Open item: exact flag names and the prompt and test-runner libraries are left to implementation.
- The non-interactive flag mode was added after the design was approved; the design has been updated to match.
