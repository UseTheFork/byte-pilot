---
name: choosing-tools
description: Use when selecting tools for a task, checking whether a capability is available, or deciding which tools to expose in a custom agent or reusable prompt
---

# Choosing Tools

## Overview

Select a tool by the task's actual operation and its target: workspace, terminal, web page, GitHub, session history, or another agent. Tool availability varies by agent and session, so confirm before relying on a capability.

## Quick Reference

| Need                             | Start with                                                    |
| -------------------------------- | ------------------------------------------------------------- |
| Find a workspace file or content | `file_search`, `grep_search`, or `semantic_search`            |
| Read or change workspace files   | `read_file`, `apply_patch`, or `create_file`                  |
| Run or inspect code and tests    | `run_in_terminal`, `get_errors`, or `testFailure`             |
| Navigate code symbols            | `vscode_listCodeUsages` or `vscode_renameSymbol`              |
| Read or control a web page       | Browser tools; use `fetch_webpage` for page content retrieval |
| Search GitHub or prior sessions  | `github_text_search`, `github_repo`, or `session_store_sql`   |
| Delegate, plan, or ask the user  | `runSubagent`, `manage_todo_list`, or `vscode_askQuestions`   |

For tool names, selection boundaries, and all tools available in this session, read [tool-catalog.md](tool-catalog.md). Use `tool_search` to load deferred tools before calling them. A delegated agent may have a different toolset; verify its actual access rather than assuming yours is inherited.

## When Building Customizations

Choose only tools needed for the agent's expected workflow. A prompt or agent should not imply access to capabilities it does not receive. For `.agent.md`, `.prompt.md`, or `SKILL.md` authoring, use the corresponding customization skill as well; this catalog does not replace those requirements.
