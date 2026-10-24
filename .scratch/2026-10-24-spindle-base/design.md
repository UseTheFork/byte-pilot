# Spindle base design

## Intent

`spindle` is a CLI that scaffolds and maintains a project's `.github` directory (agents, instructions, skills, `copilot-instructions.md`) from Nunjucks stubs, filled in with values the user supplies.

## Success criteria

- `spindle init` asks which stacks the project uses, then renders every stub into `.github/skills/` using the user's answers.
- `.github/spindle.json` holds spindle's options (selected stacks and variable answers); it does not track skills.
- spindle refuses to run when `just` is not installed.
- Each skill carries a `version` in its `SKILL.md` frontmatter, so outdated installs can be detected.
- The current `.github/skills` are the initial stub set.

## Scope

In scope (base):

- Skills only. All current skills in `.github/skills` ship, including the `int-*` internal skills. `init` always installs all of them; there is no skill selection.
- Stubs in `src/stubs/skills/<name>/`, mirroring each skill directory, including sub-files such as `templates/`.
- Nunjucks rendering with variables.
- `.github/spindle.json` config.
- `version` frontmatter on every skill.
- Update detection by version comparison.

Out of scope (later): agents, instructions and `copilot-instructions.md` stubs.

## Constraints

- The existing `package.json` already declares the `init`, `validate` and `publish` scripts. The `bin` entry has been renamed from `byte` to `spindle`.
- Existing skills contain literal `{{VSCODE_...}}` placeholders that Nunjucks would try to render.
- `just` is a hard prerequisite of spindle (user decision). Every command checks for it first; if missing it exits with an error and an install link, and never installs `just` itself.
- spindle only writes inside `.github`. The `justfile` and `docs/agents/*` are written by an agent following the `setup-project` skill, whose content depends on the chosen stacks. This must be stated explicitly in `setup-project` (user condition).
- spindle is opinionated: the first supported stacks are PHP (Laravel), Python and TypeScript. Users multi-select at least one.

## Approaches considered

- **A. Hash-based with stored variables.** Silently updates unedited files and prompts only on edited ones. Needs a content hash and the stored variables in the config.
- **B. Three-way merge.** Merges automatically and prompts only on conflicts. Needs a stored base copy and is the most machinery.
- **C. Version-only (selected).** Only the skill version is compared. Any skill whose stub version is newer than the installed `SKILL.md` version triggers a prompt.

## Selected direction (user decision: C)

- The installed version lives in each installed skill's `SKILL.md` frontmatter (user decision). `spindle.json` does not store per-skill data.
- `spindle update` reads the `version` from each installed `SKILL.md` and compares it to the stub's version. For each outdated skill it prompts the user to overwrite or skip, then re-renders using the variables stored in `spindle.json`.
- An installed skill with a missing or non-semver `version` is skipped with a warning. Only a strictly greater stub version counts as outdated.
- `update` only considers skills already on disk.
- `spindle.json` stores project-level data only, with this shape (variable values are plain strings; stack ids are `php-laravel`, `python`, `typescript`):

  ```json
  { "stacks": ["php-laravel", "typescript"], "variables": { "<name>": "<value>" } }
  ```

  Stacks are asked first during `init` (user decision) and shape the just recipes and the `setup-project` skill. Nothing is stored per skill.

- If `spindle.json` exists, `init` stops and points to `update`. If skill directories exist without a config, `init` prompts overwrite or skip for each one.
- Changing stacks or variables after `init` is done by hand-editing `spindle.json` and running `update`. A `spindle config` command is planned for later (user decision).
- Only text files render through Nunjucks; other files are copied verbatim. Sub-files such as `setup-project/templates/` are ordinary files of their skill.
- Edited and unedited files are not distinguished, so users are prompted for every outdated skill.
- The earlier "detect and prompt" choice is satisfied at the version level only.

## Assumptions (my recommendations, not yet confirmed)

- Nunjucks is configured with custom delimiters (`<%= %>`, `<% %>`) so existing `{{VSCODE_...}}` text stays untouched.
- Terminology (my choice, user delegated): a **stub** is the Nunjucks source shipped with spindle; the rendered output in the user's repo is just a **skill**. See `GLOSSARY.md`.
- The variable inventory comes from scanning the current skills for project-specific values (Just recipes, `docs/agents/*` paths, `.scratch` convention, triage labels), each defaulting to today's text. The list is reviewed before implementation.
- Versions are semver strings in `SKILL.md` frontmatter. Sub-files share their skill's version.

## Left to implementation

- CLI argument parsing library and prompt library.
- The final variable list (inventory pending review).
- Command naming (`init`, `update`, `validate`, `publish`) and their exact behavior.
