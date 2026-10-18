---
name: writing-prompt-files
description: Use when creating or revising reusable VS Code prompt files (`.prompt.md`) for manually invoked chat tasks.
---

# Writing Prompt Files

## Overview

A prompt file packages a repeatable, user-invoked task for VS Code Chat. Make its body a precise task contract: what to do, what context to use, and what result to return.

## Choose the Right Customization

| Use | When |
|---|---|
| Prompt file | The user explicitly runs a repeatable task, such as reviewing a change or generating tests. |
| Instructions | Guidance should apply automatically. |
| Skill | Reusable expertise or a workflow should apply when relevant. |
| Custom agent | A persistent role needs its own tools or behavior. |

Prompt files use the Local harness. Workspace files belong in `.github/prompts/`; user prompt files are managed from the Agent Customizations editor or the prompt-file commands.

## Authoring

1. Name the task with a short, recognizable filename; it becomes the default slash-command name.
2. Add YAML frontmatter only for metadata that improves discovery or changes execution. Supported fields include `name`, `description`, `argument-hint`, `agent`, `model`, and `tools`.
3. In the Markdown body, state the task, relevant scope, constraints, and expected output. Use concrete deliverables and ordering when the output shape matters.
4. Keep variable inputs explicit. Use built-in variables such as `${selection}` or `${input:focus:area to focus on}` when the user should supply context.
5. Reference workspace files with relative Markdown links or `#file:` paths, using forward slashes. Reference tools with `#tool:<name>` when needed.

Example:

```markdown
---
name: review-change
description: Review the current changes for correctness and regressions
argument-hint: "[focus area]"
---

Review the current changes. Focus on `${input:focus:correctness, regressions, and missing tests}`.

Return actionable findings first, ordered by severity, with file references. If you find no issues, say so and list any remaining test gaps.
```

## Test and Refine

Run the prompt with representative input using its slash command, the Command Palette, or the editor play button. Check that it uses the intended files and tools and returns the promised output. Revise the prompt when results are ambiguous, incomplete, or inconsistent. If the prompt is not discoverable, inspect Agent Debug Logs for discovery or parsing errors.

When both a prompt and its selected custom agent specify tools, the prompt's `tools` list takes precedence; unavailable tools are ignored. Leave `agent`, `model`, and `tools` unset unless the task needs them.

## Common Mistakes

- Writing broad role instructions instead of a specific repeatable task.
- Omitting the expected output, causing inconsistent response shapes.
- Duplicating automatic instructions or embedding large reference material instead of linking to it.
- Assuming prompt files are automatically applied or available outside Local harness sessions.
- Adding metadata or tools without verifying they are needed.

## Reference

See [Use prompt files in VS Code](https://code.visualstudio.com/docs/agent-customization/prompt-files) for the current format, locations, variables, and commands.
