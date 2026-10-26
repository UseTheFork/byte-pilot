# Ticket 05 — variable inventory (DRAFT)

**User sign-off is pending.** Ticket 05 acceptance requires the user to explicitly review and approve this inventory before implementation. This is a proposal, not an approved manifest.

## Scan coverage

- Scanned all **54 files** under `.github/skills` (all nested files, including `int-*` and non-`int-*` skills).
- Listed **29 skill directories** (31 directories total when including `.github/skills/` and the nested `setup-project/templates/`).
- Used recursive, ignore-inclusive searches for paths, Just recipes, tracker fields/labels, glossary/ADR conventions, and instruction locations; then inspected the relevant source sections and the provided issue/spec/design, `GLOSSARY.md`, `src/variables.ts`, and all four `docs/agents/*.md` files.
- `.github/scripts/**` was noted only as context for recipe references (not counted as skills or scanned for variable candidates): `setup-project` and `sdd::workspace` recipes have backing scripts there.
- Coverage directories: `author-agent`, `author-design`, `author-instruction`, `author-skill`, `grill-design`, `grill-with-docs`, `implement`, `implement-spec`, `improve-codebase-architecture`, `int-code-review`, `int-codebase-design`, `int-domain-modeling`, `int-grilling`, `int-prototype`, `int-research`, `int-retrospective`, `int-subagent-driven-dev`, `int-test-driven-development`, `int-verification-before-completion`, `int-writing-agents`, `int-writing-for-agents`, `int-writing-instruction`, `int-writing-skills`, `retrospective`, `setup-project`, `to-spec`, `to-tickets`, `triage`, `wayfinder` (plus `setup-project/templates/`).

Counts below are literal occurrences in skill files for the default token/pattern. Repeated occurrences are counted within each file. For category words such as `bug`, counts include prose uses too; do not blindly replace every occurrence as a label.

## Proposed variables

| Name | Description | Default (today's text) | Skills using it (file path: occurrences) |
|---|---|---|---|
| `tooling_doc_path` | Location of project tooling guidance. | `docs/agents/tooling.md` | `.github/skills/setup-project/SKILL.md: 5` |
| `issue_tracker_doc_path` | Location of local issue-tracker guidance. | `docs/agents/issue-tracker.md` | `.github/skills/setup-project/SKILL.md: 4` |
| `triage_labels_doc_path` | Location of the category/state mapping guidance. | `docs/agents/triage-labels.md` | `.github/skills/setup-project/SKILL.md: 4` |
| `domain_doc_path` | Location of domain-documentation guidance. | `docs/agents/domain.md` | `.github/skills/setup-project/SKILL.md: 3` |
| `feature_directory_pattern` | Canonical dated local feature directory; replace this exact convention wherever referenced. | `.scratch/YYYY-MM-DD-<feature-slug>/` | `.github/skills/to-tickets/SKILL.md: 1`; `.github/skills/to-spec/SKILL.md: 1`; `.github/skills/setup-project/templates/issue-tracker-local.md: 5`; `.github/skills/setup-project/SKILL.md: 1`; `.github/skills/int-subagent-driven-dev/SKILL.md: 1`; `.github/skills/retrospective/SKILL.md: 1`; `.github/skills/author-design/SKILL.md: 1`; `.github/skills/int-retrospective/SKILL.md: 1` |
| `ticket_file_pattern` | Relative path/name format for local implementation tickets. | `.scratch/YYYY-MM-DD-<feature-slug>/issues/<NN>-<slug>.md` | `.github/skills/to-tickets/SKILL.md: 1`; `.github/skills/setup-project/templates/issue-tracker-local.md: 1` |
| `reports_directory_pattern` | Location of durable delivery reports. | `.scratch/YYYY-MM-DD-<feature-slug>/reports/` | `.github/skills/setup-project/templates/issue-tracker-local.md: 1` |
| `spec_file_pattern` | Location of a feature spec in the local tracker. | `.scratch/YYYY-MM-DD-<feature-slug>/spec.md` | `.github/skills/setup-project/templates/issue-tracker-local.md: 1` |
| `retrospective_file_pattern` | Location of a local retrospective report. | `.scratch/YYYY-MM-DD-<feature-slug>/retrospective.md` | `.github/skills/retrospective/SKILL.md: 1`; `.github/skills/int-retrospective/SKILL.md: 1` |
| `wayfinding_map_pattern` | Local map path used by `/wayfinder`. | `.scratch/YYYY-MM-DD-<effort-slug>/map.md` | `.github/skills/setup-project/templates/issue-tracker-local.md: 1` |
| `wayfinding_ticket_pattern` | Local child-ticket path used by `/wayfinder`. | `.scratch/YYYY-MM-DD-<effort-slug>/issues/NN-<slug>.md` | `.github/skills/setup-project/templates/issue-tracker-local.md: 1` |
| `category_field` | Field name for local tracker category values. | `Category:` | `.github/skills/triage/SKILL.md: 1`; `.github/skills/triage/AGENT-BRIEF.md: 4`; `.github/skills/setup-project/templates/triage-labels.md: 3`; `.github/skills/setup-project/templates/issue-tracker-local.md: 2`; `.github/skills/setup-project/SKILL.md: 4` |
| `status_field` | Field name for local tracker triage state. | `Status:` | `.github/skills/triage/SKILL.md: 1`; `.github/skills/to-tickets/SKILL.md: 1`; `.github/skills/setup-project/templates/triage-labels.md: 6`; `.github/skills/setup-project/templates/issue-tracker-local.md: 10`; `.github/skills/setup-project/SKILL.md: 3`; `.github/skills/int-subagent-driven-dev/implementer-prompt.md: 1` |
| `category_bug` | Local category label for a defect. | `bug` | `.github/skills/int-prototype/LOGIC.md: 1`; `.github/skills/triage/SKILL.md: 4`; `.github/skills/triage/OUT-OF-SCOPE.md: 1`; `.github/skills/triage/AGENT-BRIEF.md: 6`; `.github/skills/int-writing-for-agents/SKILL.md: 2`; `.github/skills/int-codebase-design/SKILL.md: 1`; `.github/skills/int-writing-skills/SKILL.md: 1`; `.github/skills/setup-project/templates/triage-labels.md: 2`; `.github/skills/int-verification-before-completion/SKILL.md: 1`; `.github/skills/setup-project/templates/issue-tracker-local.md: 1`; `.github/skills/improve-codebase-architecture/SKILL.md: 1`; `.github/skills/setup-project/SKILL.md: 3`; `.github/skills/int-test-driven-development/tests.md: 2`; `.github/skills/improve-codebase-architecture/HTML-REPORT.md: 1`; `.github/skills/retrospective/SKILL.md: 2`
| `category_enhancement` | Local category label for a feature/improvement. | `enhancement` | `.github/skills/triage/SKILL.md: 3`; `.github/skills/triage/OUT-OF-SCOPE.md: 2`; `.github/skills/triage/AGENT-BRIEF.md: 6`; `.github/skills/setup-project/templates/triage-labels.md: 2`; `.github/skills/setup-project/templates/issue-tracker-local.md: 1`; `.github/skills/setup-project/SKILL.md: 2` |
| `state_needs_triage` | Triage label for work awaiting maintainer evaluation. | `needs-triage` | `.github/skills/triage/SKILL.md: 5`; `.github/skills/triage/AGENT-BRIEF.md: 1`; `.github/skills/setup-project/templates/triage-labels.md: 2`; `.github/skills/setup-project/templates/issue-tracker-local.md: 1`; `.github/skills/setup-project/SKILL.md: 2` |
| `state_needs_info` | Triage label for work awaiting reporter information. | `needs-info` | `.github/skills/triage/SKILL.md: 7`; `.github/skills/setup-project/templates/triage-labels.md: 2`; `.github/skills/setup-project/templates/issue-tracker-local.md: 1`; `.github/skills/setup-project/SKILL.md: 1` |
| `state_ready_for_agent` | Triage label for work ready for an agent. | `ready-for-agent` | `.github/skills/wayfinder/SKILL.md: 1`; `.github/skills/triage/SKILL.md: 7`; `.github/skills/triage/AGENT-BRIEF.md: 2`; `.github/skills/to-tickets/SKILL.md: 2`; `.github/skills/to-spec/SKILL.md: 2`; `.github/skills/setup-project/templates/triage-labels.md: 2`; `.github/skills/setup-project/templates/issue-tracker-local.md: 1`; `.github/skills/setup-project/SKILL.md: 1` |
| `state_ready_for_human` | Triage label for work needing human action. | `ready-for-human` | `.github/skills/triage/SKILL.md: 4`; `.github/skills/setup-project/templates/triage-labels.md: 2`; `.github/skills/setup-project/templates/issue-tracker-local.md: 1`; `.github/skills/setup-project/SKILL.md: 1` |
| `state_wontfix` | Triage label for rejected work. | `wontfix` | `.github/skills/triage/SKILL.md: 4`; `.github/skills/triage/OUT-OF-SCOPE.md: 3`; `.github/skills/triage/AGENT-BRIEF.md: 2`; `.github/skills/setup-project/templates/triage-labels.md: 2`; `.github/skills/setup-project/SKILL.md: 1` |
| `out_of_scope_directory` | Directory holding records of rejected requests. | `.out-of-scope/` | `.github/skills/triage/SKILL.md: 4`; `.github/skills/triage/OUT-OF-SCOPE.md: 9`; `.github/skills/triage/AGENT-BRIEF.md: 8` |
| `root_glossary_path` | Root glossary location. | `GLOSSARY.md` | `.github/skills/grill-design/SKILL.md: 1`; `.github/skills/triage/SKILL.md: 1`; `.github/skills/int-domain-modeling/SKILL.md: 10`; `.github/skills/setup-project/templates/domain.md: 6`; `.github/skills/setup-project/SKILL.md: 3`; `.github/skills/int-domain-modeling/GLOSSARY-FORMAT.md: 7`; `.github/skills/int-retrospective/retrospective-prompt.md: 1`; `.github/skills/int-codebase-design/DESIGN-IT-TWICE.md: 1`; `.github/skills/int-test-driven-development/SKILL.md: 1`; `.github/skills/improve-codebase-architecture/SKILL.md: 7` |
| `glossary_map_path` | Root map that points to per-context glossaries. | `GLOSSARY-MAP.md` | `.github/skills/int-domain-modeling/SKILL.md: 2`; `.github/skills/int-domain-modeling/GLOSSARY-FORMAT.md: 2`; `.github/skills/setup-project/templates/domain.md: 3`; `.github/skills/setup-project/SKILL.md: 2`; `.github/skills/int-retrospective/retrospective-prompt.md: 1`; `.github/skills/grill-design/SKILL.md: 1` |
| `adr_directory` | System-wide ADR directory. | `docs/adr/` | `.github/skills/int-domain-modeling/SKILL.md: 3`; `.github/skills/int-domain-modeling/ADR-FORMAT.md: 3`; `.github/skills/setup-project/SKILL.md: 4`; `.github/skills/setup-project/templates/domain.md: 6`; `.github/skills/improve-codebase-architecture/SKILL.md: 1` |
| `context_adr_directory_pattern` | Per-context ADR directory convention for multi-context repos. | `src/<context>/docs/adr/` | `.github/skills/setup-project/templates/domain.md: 1` |
| `project_setup_recipe` | Just recipe that bootstraps the local project docs. | `just setup-project::setup-project --workspace /absolute/project/root` | `.github/skills/setup-project/SKILL.md: 1` |
| `report_workspace_recipe` | Just recipe that resolves report destinations. | `just sdd::workspace --workspace <checkout> --reports-dir <feature-reports-directory> --ticket <NN>` | `.github/skills/setup-project/templates/issue-tracker-local.md: 1`; `.github/skills/int-subagent-driven-dev/example-workflow.md: 1` (same recipe, concrete example arguments) |
| `tooling_just_recipe_list` | Newline-delimited starter Just recipe list; current values come from the tooling template. | `just setup\njust lint::frontend *args\njust lint::backend *args\njust format::frontend *args\njust format::backend *args\njust test::types-frontend\njust test::types-backend\njust test::generate-types\njust laravel::artisan *args\njust tool::git *args\njust tool::pnpm *args\njust tool::composer *args\njust test::test *args\njust test::coverage *args\njust test::test --filter=<test-name>\njust test::test --testsuite=Unit\njust test::test --testsuite=Integration\njust test::test --testsuite=E2E` | `.github/skills/setup-project/templates/tooling.md: 18` |

## Proposed manifest JSON

The block uses the `VariableDefinition` format from `src/variables.ts`; every name is identifier-like and every default is a string. The recipe-list default is a newline-delimited string. Review the decisions below before treating this as final.

```json
[
  { "name": "tooling_doc_path", "description": "Location of project tooling guidance.", "default": "docs/agents/tooling.md" },
  { "name": "issue_tracker_doc_path", "description": "Location of local issue-tracker guidance.", "default": "docs/agents/issue-tracker.md" },
  { "name": "triage_labels_doc_path", "description": "Location of category/state mapping guidance.", "default": "docs/agents/triage-labels.md" },
  { "name": "domain_doc_path", "description": "Location of domain-documentation guidance.", "default": "docs/agents/domain.md" },
  { "name": "feature_directory_pattern", "description": "Canonical dated local feature directory.", "default": ".scratch/YYYY-MM-DD-<feature-slug>/" },
  { "name": "ticket_file_pattern", "description": "Relative path/name format for local implementation tickets.", "default": ".scratch/YYYY-MM-DD-<feature-slug>/issues/<NN>-<slug>.md" },
  { "name": "reports_directory_pattern", "description": "Location of durable delivery reports.", "default": ".scratch/YYYY-MM-DD-<feature-slug>/reports/" },
  { "name": "spec_file_pattern", "description": "Location of a feature spec in the local tracker.", "default": ".scratch/YYYY-MM-DD-<feature-slug>/spec.md" },
  { "name": "retrospective_file_pattern", "description": "Location of a local retrospective report.", "default": ".scratch/YYYY-MM-DD-<feature-slug>/retrospective.md" },
  { "name": "wayfinding_map_pattern", "description": "Local map path used by /wayfinder.", "default": ".scratch/YYYY-MM-DD-<effort-slug>/map.md" },
  { "name": "wayfinding_ticket_pattern", "description": "Local child-ticket path used by /wayfinder.", "default": ".scratch/YYYY-MM-DD-<effort-slug>/issues/NN-<slug>.md" },
  { "name": "category_field", "description": "Field name for local tracker category values.", "default": "Category:" },
  { "name": "status_field", "description": "Field name for local tracker triage state.", "default": "Status:" },
  { "name": "category_bug", "description": "Local category label for a defect.", "default": "bug" },
  { "name": "category_enhancement", "description": "Local category label for a feature/improvement.", "default": "enhancement" },
  { "name": "state_needs_triage", "description": "Triage label for work awaiting maintainer evaluation.", "default": "needs-triage" },
  { "name": "state_needs_info", "description": "Triage label for work awaiting reporter information.", "default": "needs-info" },
  { "name": "state_ready_for_agent", "description": "Triage label for work ready for an agent.", "default": "ready-for-agent" },
  { "name": "state_ready_for_human", "description": "Triage label for work needing human action.", "default": "ready-for-human" },
  { "name": "state_wontfix", "description": "Triage label for rejected work.", "default": "wontfix" },
  { "name": "out_of_scope_directory", "description": "Directory holding records of rejected requests.", "default": ".out-of-scope/" },
  { "name": "root_glossary_path", "description": "Root glossary location.", "default": "GLOSSARY.md" },
  { "name": "glossary_map_path", "description": "Root map that points to per-context glossaries.", "default": "GLOSSARY-MAP.md" },
  { "name": "adr_directory", "description": "System-wide ADR directory.", "default": "docs/adr/" },
  { "name": "context_adr_directory_pattern", "description": "Per-context ADR directory convention for multi-context repos.", "default": "src/<context>/docs/adr/" },
  { "name": "project_setup_recipe", "description": "Just recipe that bootstraps the local project docs.", "default": "just setup-project::setup-project --workspace /absolute/project/root" },
  { "name": "report_workspace_recipe", "description": "Just recipe that resolves report destinations.", "default": "just sdd::workspace --workspace <checkout> --reports-dir <feature-reports-directory> --ticket <NN>" },
  { "name": "tooling_just_recipe_list", "description": "Newline-delimited starter Just recipe list; current values come from the tooling template.", "default": "just setup\njust lint::frontend *args\njust lint::backend *args\njust format::frontend *args\njust format::backend *args\njust test::types-frontend\njust test::types-backend\njust test::generate-types\njust laravel::artisan *args\njust tool::git *args\njust tool::pnpm *args\njust tool::composer *args\njust test::test *args\njust test::coverage *args\njust test::test --filter=<test-name>\njust test::test --testsuite=Unit\njust test::test --testsuite=Integration\njust test::test --testsuite=E2E" }
]
```

## Decisions needed from the user

1. **Scratch-path grouping:** approve separate variables for the dated feature root, ticket/report/spec/retrospective paths, and Wayfinder map/child paths, or prefer one configurable scratch root plus fixed subpaths? Wayfinder uses an `<effort-slug>` form distinct from `<feature-slug>`.
2. **Triage token scope:** approve separate category/state label variables and field-name variables? `bug`/`enhancement` also appear as ordinary prose; label substitution must target role/mapping contexts, not every matching word. Should `Reporter:` and `Execution:` also be configurable fields, or remain part of the local tracker schema?
3. **Just recipes versus stack-driven content:** decide whether the tooling recipe list belongs in the manifest or should be generated only from selected stacks and verified project recipes. The `tooling.md` template is a starter, not a verified recipe inventory. The setup bootstrap and report-workspace recipes are bundled helper commands; confirm whether users should be able to override them.
4. **Glossary/ADR paths:** decide whether root `GLOSSARY.md`, optional `GLOSSARY-MAP.md`, system `docs/adr/`, and `src/<context>/docs/adr/` should be variables or remain universal conventions. The context-scoped ADR path is only named once and is conditional on a multi-context layout.
5. **Hard-coded Copilot/VS Code structure:** `.github/copilot-instructions.md`, `.github/agents/`, `.github/instructions/`, `.github/skills/`, `.agent.md`, and `.instructions.md` are standard Copilot/VS Code concepts, so this draft leaves them hard-coded rather than making generic framework locations user variables.
6. **Out-of-scope knowledge base:** confirm whether `.out-of-scope/` is a project-specific directory worth exposing as a variable or a fixed convention of the triage skill.
7. **Stack-driven setup note:** all skills reference stack-driven content for `setup-project`; in particular its generated `docs/agents/tooling.md` commands must reflect selected stacks and verified recipes. Decide whether the listed tooling examples are variables at all, rather than stack-driven output.
8. **Other tracker schema:** `Reporter:`, `Execution:`, report naming, UTC comment timestamps, and ticket checklist/status conventions are present in local Markdown guidance. This draft keeps the first two as decision-only and leaves generic Markdown syntax and checklist semantics hard-coded; confirm if any should be configurable.

## Exclusions and cautions

- Do not make variables for generic Copilot/VS Code concepts or paths.
- Do not replace example-only dated paths (for example concrete examples in `example-workflow.md`) with defaults; they illustrate the convention rather than configure a project.
- The recipe catalog is deliberately provisional: setup-project verifies available commands per repo and selected stack, so the template's current Laravel/PHP/TypeScript examples must not be presented as universal commands.
