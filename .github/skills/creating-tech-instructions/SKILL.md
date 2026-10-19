---
name: creating-tech-instructions
description: Use when creating or updating a repository's `.github/instructions/tech.md` file for Copilot with project tooling, environment requirements, or commands.
---

# Creating Technical Instructions

## Overview

Document the repository's confirmed toolchain and contributor commands. Inspect evidence before recommending tools; never fill gaps with generic defaults.

## Workflow

1. Inspect existing `tech.md`, manifests and lockfiles, version files, scripts, task runners, tool configs, CI, project docs, and source. Determine whether this is an implemented project or scaffold.
2. If sparse or scaffolded, first ask: “Is this a new project, or is implementation/configuration elsewhere?” Do not choose tools before the answer. Then ask only for missing material choices (language, package manager, runtime, build/test tools). If unavailable, document observed absences and leave unknowns unspecified.
3. For established projects, derive guidance from checked-in config and current docs; resolve conflicts against scripts and CI.
4. Create or update exactly `.github/instructions/tech.md`. Include confirmed tools, versions, prerequisites, commands, and constraints. State when relevant commands are absent; never invent them.
5. Run safe, relevant commands when practical. Configured does not mean passing. Do not install, deploy, or run destructive commands without authorization. Label commands configured, documented, or executed; report failures and skipped runs.

## Content Shape

Use a short structure suited to the repository:

```markdown
# Technical Context

## Toolchain

- Runtime and version source
- Package manager and version source

## Commands

| Command | Purpose | Source / verification                      |
| ------- | ------- | ------------------------------------------ |
| `...`   | ...     | `package.json` script; configured, not run |

## Constraints

- Relevant environment or workflow requirements
```

Include only evidenced sections and exact commands. Name each source. Distinguish absent commands from configured commands that were not run.

## Scope and Format

Cover languages, runtimes, package managers, tools, versions, commands, and environment constraints. Product purpose belongs in `product.md`; architecture and coding conventions belong elsewhere.

Use plain Markdown at the requested path; do not add front matter or silently rename it. VS Code's Copilot discovery uses `*.instructions.md`, so `tech.md` is not automatically attached by that convention. If automatic discovery is expected, explain the mismatch and ask before changing the path. Do not explain how to enable instructions.

## Common Mistakes

| Mistake                                                 | Better approach                                                                                             |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Recommending `npm test` because the repo uses Node      | Inspect scripts, test configuration, and CI; say when no test command is configured.                        |
| Assuming an empty source tree means the project is new  | Scan manifests, docs, and config first, then ask whether implementation is elsewhere or the project is new. |
| Treating a declared script as a passing check           | Label it configured until a fresh run confirms it succeeds.                                                 |
| Listing commands without their purpose or source        | Use the command table and cite the file that defines or documents each one.                                 |
| Adding tools or versions to make the file look complete | Include only confirmed choices; ask about material gaps.                                                    |
