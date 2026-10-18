# Subagents Reference (Local harness)

Source: https://code.visualstudio.com/docs/agents/run/subagents

A subagent works in its own context and returns a focused result to the main agent. Use it for research before implementation, comparing approaches, or reviewing separate concerns. For a quick lookup or small edit, ask directly; delegation costs extra model usage.

## Invoking

- Ask in natural language ("Use a subagent to find how auth works. Do not change files.") or let the main agent decide.
- The `agent` tool set (`agent/runSubagent`) must be enabled in the caller's tools.
- For a reusable workflow, add `agent` to a prompt file's `tools` and describe the delegated task and expected result in the body.
- A Local subagent does NOT inherit conversation history and is stateless: no follow-up messages to the same subagent; a new invocation needs fresh context.
- Ask-questions and todo tools are unavailable to Local subagents.

A self-contained task states:

| Part            | Content                                        |
| --------------- | ---------------------------------------------- |
| Goal            | Question to answer or work to complete         |
| Context         | Relevant files, constraints, decisions made    |
| Allowed actions | Research only, or may make changes             |
| Expected result | Findings, recommendation, or changes to return |

## Running a custom agent as a subagent

Without a custom agent, a subagent inherits the main agent's instructions and tools. A custom agent supplies task-specific instructions and can override tools and model.

```markdown
---
name: Codebase Researcher
description: Find relevant code and explain existing patterns
user-invocable: false
tools: ["read", "search"]
---

Research the requested topic without changing files.
Return relevant file paths, existing patterns, and unanswered questions.
```

Request it: `Use the Codebase Researcher subagent to explain how authentication works.` Names are case-sensitive; use the exact `name`.

### Controlling availability

| Property                      | Effect                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------- |
| `user-invocable`              | Picker visibility only. `false` hides subagent-only helpers. Default true       |
| `disable-model-invocation`    | `true` stops other agents invoking it. Default false                            |
| `agents` (on the coordinator) | `['A', 'B']` allows only those; `['*']` or omitted allows all; `[]` allows none |

- Coordinator `tools` must include `agent`.
- Listing an agent in `agents` overrides that agent's `disable-model-invocation: true`.
- `infer` is deprecated; replaced by the two properties above.

## Model selection (first match wins)

1. Explicit model parameter the main agent passes to `runSubagent`.
2. The custom agent's `model` property (name or prioritized list).
3. The main conversation's model.

To request one: "Use a subagent with <model name> to review error handling." A selection above the main model's cost tier is refused and available models are listed.

## Nesting

Subagents cannot invoke subagents by default. When enabled, depth is capped at five. Include a stopping condition so recursive agents don't re-delegate the same work.

```markdown
---
name: Recursive Processor
description: Research independent files in small groups
tools: ["agent", "read", "search"]
agents: ["Recursive Processor"]
---

Summarize each file without changing it.

- More than four files: split in half, delegate each half to a Recursive Processor subagent.
- Four or fewer, or delegation unavailable: summarize directly.
- Combine results into one summary.
```

## Orchestration patterns

### Coordinator and worker

Read-only workers, an editing coordinator restricted to named workers:

```markdown
---
name: Feature Builder
description: Implement features with delegated research and review
tools: ["agent", "edit", "read", "search"]
agents: ["Codebase Researcher", "Reviewer"]
---

For each feature request:

1. Ask Codebase Researcher to find relevant files and existing patterns.
2. Use its findings to implement the change.
3. Ask Reviewer to check the changed files, passing requirements and a change summary.
4. Address findings, then summarize changes and remaining risks.
```

`Reviewer` is another `user-invocable: false` agent with `tools: ['read', 'search']` that reports correctness issues and missing tests without editing. A second review is a new invocation with updated context.

### Multi-perspective review (one-off, no agent files)

"Use two subagents to review the current changes without editing files. One checks correctness, the other test coverage. Combine findings, remove duplicates, prioritize." Separate contexts surface different issues but don't guarantee correctness; review combined findings.

## Following progress

- Local: a running subagent shows as a collapsed tool call with agent name and activity; select it to see prompt, tool calls, and result.
- Agents window: subagents are read-only chats (lock icon) opened from the parent chat's indicator.

## Troubleshooting

| Symptom                         | Check                                                                                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Main agent doesn't delegate     | `agent/runSubagent` selected in Configure Tools; explicitly request a subagent with a focused task                                         |
| Custom agent unavailable        | Exact case-sensitive name, `disable-model-invocation`, coordinator's `agents` list (`user-invocable: false` only hides it from the picker) |
| Requested model doesn't run     | Pick a model from the error's list or drop the preference                                                                                  |
| Subagent can't delegate further | Nesting enabled, depth limit, `agent` in its tools                                                                                         |
