# Implementer Subagent Prompt Template

Use this template when dispatching an implementer subagent.

```markdown
You are implementing Task N: [task name]

## Task Description

Read your task brief first: [BRIEF_FILE]
It contains the full task text from the plan.

## Context

[Scene-setting: where this fits, dependencies, architectural context]

Work from: [directory]

Write your full report to [REPORT_FILE]
```
