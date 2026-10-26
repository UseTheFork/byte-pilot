Reporter: unknown
Category: enhancement

# 04: Stacks, variables and prompts

**What to build:** `init` asks for stacks first (required multi-select of `php-laravel`, `python`, `typescript`), then for each variable with a default, and saves both to `.github/spindle.json`. Every prompt has a flag equivalent, and a switch disables prompting. In non-interactive mode, missing required input is an error rather than a hang.

**Blocked by:** 01

**Status:** ready-for-agent
**Execution:** integrated

- [X] Interactive stack selection requires at least one stack; flags accept repeated stack values
- [X] Unknown stack ids are rejected with a clear error
- [X] Variables prompt with defaults; flags supply values; defaults apply when allowed
- [X] `spindle.json` has the shape `{ "stacks": [...], "variables": { "<name>": "<value>" } }` with string values and nothing per skill
- [X] Non-interactive mode with missing required input exits non-zero with a clear error
- [X] Flag names are documented in the CLI help
- [X] Tests at the CLI seam use flags and cover each of the above

Checklist key: `- [ ]` Not started; `- [X]` Complete; `- [-]` In progress; `- [S]` Skipped.

## Comments
