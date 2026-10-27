---
name: author-skill
description: Create or update a project skill from the user's requirements
argument-hint: "[skill idea or requirements]"
disable-model-invocation: true
user-invocable: true
---

Create a skill based on these requirements:

```
${input:requirements:Describe the skill or capability to create}
```

Before acting, YOU MUST read and follow each required skill:

- **REQUIRED:** `int-writing-skills`
- **REQUIRED:** `int-test-driven-development-advanced`
- **REQUIRED:** `int-writing-for-agents`
- **REQUIRED:** `int-verification-before-completion`

Create the skill in `.github/skills/<skill-name>/SKILL.md`, following the repository's conventions and the requested scope. Complete the task rather than returning only a plan. Do not modify unrelated files. Finish with a concise summary of the created skill and verification performed, including any blockers or unverified requirements.
