---
name: create-skill
description: Create a project skill from the user's requirements
argument-hint: "[skill idea or requirements]"
---

Create a skill based on these requirements:
```
${input:requirements:Describe the skill or capability to create}
```

Before acting, read and follow each required skill:

- **REQUIRED:** #file:./../skills/writing-skills/SKILL.md
- **REQUIRED:** #file:./../skills/test-driven-development/SKILL.md
- **REQUIRED:** #file:./../skills/verification-before-completion/SKILL.md

Treat their requirements as mandatory. Follow the complete RED-GREEN-REFACTOR process for skill documentation, including baseline scenarios before authoring and validation after authoring. Follow TDD for any implementation code involved. Run fresh, relevant verification before making completion claims. If a required test or verification cannot be performed with available tools, report that limitation accurately; do not claim it passed.

Create the skill in `.github/skills/<skill-name>/SKILL.md`, following the repository's conventions and the requested scope. Complete the task rather than returning only a plan. Do not modify unrelated files. Finish with a concise summary of the created skill and verification performed, including any blockers or unverified requirements.
