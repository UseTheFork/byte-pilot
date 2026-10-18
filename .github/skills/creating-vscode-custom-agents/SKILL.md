---
name: creating-vscode-custom-agents
description: Use when creating, editing, or debugging VS Code custom agents (.agent.md files), chat modes, agent handoffs, subagent-only agents, or when a custom agent does not appear in the agents dropdown
---

# Creating VS Code Custom Agents

## Overview

A custom agent is a `.agent.md` file: optional YAML frontmatter (role config) plus a Markdown body (instructions prepended to the user's prompt). Use one when a recurring role needs its own instructions and tool set. Source: https://code.visualstudio.com/docs/agent-customization/custom-agents

Pick the right customization: agent = role + tools; skill = reusable knowledge/workflow; instructions file = always-on rules; prompt file = one-shot task.

## File Locations

| Scope | Path |
|---|---|
| Workspace | `.github/agents/` |
| User (Copilot) | `~/.copilot/agents/` |

Any `.md` in `.github/agents/` is detected.

## Frontmatter

| Field | Purpose |
|---|---|
| `description` | Shown as chat input placeholder. Write it. |
| `name` | Defaults to file name |
| `argument-hint` | Hint text in chat input |
| `tools` | List of tools, tool sets, or MCP tools (`<server>/*` for all of a server). Unavailable tools are ignored |
| `agents` | Allowed subagents: names, `*`, or `[]` for none. Requires the `agent` tool in `tools` |
| `model` | String or prioritized array; defaults to the model picker's choice |
| `user-invocable` | `false` hides from dropdown (subagent-only). Default true |
| `disable-model-invocation` | `true` blocks use as a subagent. Default false |
| `mcp-servers` | MCP config, only for `target: github-copilot` |
| `handoffs` | Suggested next-step buttons (below) |

## Subagents

For invoking, restricting, model selection, nesting, and coordinator/worker patterns, see [subagents.md](subagents.md).

## Handoffs

```yaml
handoffs:
  - label: Start Implementation   # button text
    agent: implementation         # target agent
    prompt: Now implement the plan above.
    send: false                   # true auto-submits
    model: GPT-5.2 (copilot)      # optional, "Name (vendor)"
```

## Body

- State task, guidelines, expected output.
- Link files with relative Markdown links or `#file:path` (paths resolve from the agent file; `~/` allowed; use `/` separators).
- Reference tools with `#tool:<tool-name>`, e.g. `#tool:web/fetch`.

## Minimal Example

```markdown
---
description: Review changes without editing files
tools: ['search', 'web/fetch']
---
Review changes for correctness, maintainability, and repo conventions.
Report findings grouped by severity. Never modify files.
```

## Workflow

1. Define the role and what it must NOT do.
2. Choose the minimum tools (read-only for planners/reviewers; least privilege).
3. Write `description` and body; add handoffs if it feeds another agent.
4. Save in the right location, select it in the Agent dropdown, and check its tool calls.

## Troubleshooting

| Symptom | Check |
|---|---|
| Not in dropdown | Wrong folder for the selected harness; `user-invocable: false`; right-click Chat view > Diagnostics shows load errors |
| Not usable as subagent | `disable-model-invocation: true`; caller's `agents` list excludes it; caller lacks `agent` tool |
| Tool missing | Name not available in this session (silently ignored) |
| User agent missing in Copilot harness | Profile-stored agents are Local-only; move to `~/.copilot/agents/` |

In Local sessions a prompt file's `tools` override the agent's `tools`.
