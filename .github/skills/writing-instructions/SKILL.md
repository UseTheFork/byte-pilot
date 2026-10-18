---
name: writing-instructions
description: Use when creating or revising workspace-scoped Copilot instruction files in .github/instructions, choosing their frontmatter, or deciding how to scope reusable project guidance.
---

# Writing Copilot Instructions

## Overview

Use workspace instruction files to give Copilot concise, durable project guidance that does not belong in every task prompt. Put targeted files in `.github/instructions/**/*.instructions.md`; this skill covers writing and organizing them, not enabling them in VS Code.

## Choose Scope and Files

- Make each file about one coherent topic or area, such as frontend conventions, API design, or tests.
- Split files when their rules apply to different code areas or tasks. A single broad file with conditional rules makes irrelevant guidance load and obscures which rules apply.
- Use a narrow `applyTo` pattern for file-specific conventions. Use `**` only when every workspace file genuinely needs the guidance.
- Keep repository requirements consistent with other applicable instructions. Sources can be additive; do not rely on file order or precedence to resolve conflicts.
- Do not repeat rules that are already clear in another instruction file or reliably enforced by project tooling.

## Frontmatter

All three fields are optional. Add only fields that improve discovery or scope:

| Field | Purpose |
| --- | --- |
| `name` | Display name shown in the UI; defaults to the file name. |
| `description` | Describes tasks where the instructions are relevant, supporting task-based discovery. |
| `applyTo` | Workspace-relative glob that automatically attaches the file when matching files are created or modified. |

Use `description` when the guidance is useful for a task even if no matching file is open. Use `applyTo` when guidance is tied to files. Both may be useful together. If neither is present, the file must be attached manually.

```markdown
---
name: Python tests
description: Use when creating or changing Python tests, including when no test file is open.
applyTo: "**/*test*.py"
---

# Python Tests

- Reuse the fixtures and assertion style from nearby tests because they encode project conventions.
- Test observable behavior and important edge cases; keep each test focused on one outcome.
```

Keep the body short and self-contained. State one actionable expectation per bullet and explain the reason when it helps Copilot handle edge cases. Show a concrete preferred pattern when a rule is otherwise ambiguous. Use `/` in paths and patterns.

## Validate

Try a representative task that should use the guidance. Check the response's References to confirm the instruction was included, then inspect the work and tool activity for adherence. Discovery alone does not show that the guidance shaped the result.

For current VS Code behavior and frontmatter details, consult [Use custom instructions in VS Code](https://code.visualstudio.com/docs/agent-customization/custom-instructions).
