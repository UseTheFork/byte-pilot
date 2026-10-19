---
name: create-prompt
description: Create a project prompt from the user's requirements
argument-hint: "[prompt idea or requirements]"
---

Create a prompt based on these requirements:

```
${input:requirements:Describe the prompt or capability to create}
```

Before acting, read and follow each required skill:

- **REQUIRED:** writing-skills - #file:./../skills/writing-skills/SKILL.md
- **REQUIRED:** #file:./../skills/writing-skills/SKILL.md
- **REQUIRED:** writing-prompt-files - #file:./../skills/writing-prompt-files/SKILL.md

Treat their requirements as mandatory.

Create the prompt in `.github/prompts/<prompt-name>.prompt.md`, following the repository's conventions and the requested scope. Complete the task rather than returning only a plan. Do not modify unrelated files. Finish with a concise summary of the created prompt and verification performed, including any blockers or unverified requirements.
