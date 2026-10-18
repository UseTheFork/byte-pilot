---
name: create-agent
description: Create a project custom agent from the user's requirements
argument-hint: "[agent idea or requirements]"
agent: shared-orchestrator
---

Create a custom agent based on these requirements:

```
${input:requirements:Describe the agent role, behavior, or capability to create}
```

Before acting, read and follow each required skill:

- **REQUIRED:** creating-custom-agents - #file:./../skills/creating-custom-agents/SKILL.md
- **REQUIRED:** writing-prompt-files - #file:./../skills/writing-prompt-files/SKILL.md
- **REQUIRED:** verification-before-completion - #file:./../skills/verification-before-completion/SKILL.md

Treat their requirements as mandatory. Define the agent's role and boundaries, choose only the tools it needs, and add handoffs or invocation settings only when required by the requested behavior. Follow the repository's conventions and the custom-agent format supported by this workspace.

Create the agent in `.github/agents/<agent-name>.agent.md`. Complete the task rather than returning only a plan. Do not modify unrelated files. Run relevant verification and finish with a concise summary of the created agent and verification performed, including any blockers or unverified requirements.
