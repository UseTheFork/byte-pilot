---
name: creating-structure-instructions
description: Use when creating or updating a repository's `.github/instructions/structure.instructions.md` project-structure guidance for Copilot.
---

# Creating Structure Instructions

## Overview

Document the repository's real organization and established conventions so Copilot can place and connect changes correctly. A directory proposal is not a description of the current architecture.

## Workflow

1. Inspect the existing `structure.instructions.md`, file tree, project/workspace manifests, entry points, representative source modules, imports, tests, and architecture docs. Use targeted file listings and representative examples; do not infer structure from names alone.
2. Separate four kinds of claims: **current layout** (paths that exist), **conventions** (patterns repeated in source), **architecture** (verified boundaries and dependency relationships), and **planned structure** (explicitly approved future state). Check whether docs are current and compare them with implementation.
3. If the repository is sparse or its implementation is missing, first ask whether this is a new project or whether code is elsewhere. Ask about intended boundaries only when they are not established by evidence. For stale or conflicting docs, ask about material architectural intent rather than silently choosing a side.
4. Create or update exactly `.github/instructions/structure.instructions.md`. Keep it concise and useful: describe meaningful directories and their responsibilities, file naming/placement patterns, import or module boundaries, and architecture only where evidence supports each claim. Link representative files. Put approved future plans in a clearly separate section; omit unsupported detail.
5. Validate paths and examples against the current tree and representative source. Report stale references, unresolved decisions, and any proposed structure as such.

## Content Shape

Start with this required frontmatter. `applyTo: "**"` is intentional because repository layout and module-boundary guidance informs changes throughout the workspace. Then use only relevant sections, for example:

```markdown
---
name: Project Structure
description: Repository layout, naming, imports, and architectural boundaries for project files.
applyTo: "**"
---

# Project Structure

## Current Layout

- `src/commands/`: CLI command handlers; see `src/commands/validate.ts`.

## Conventions

- Shared helpers live in `src/lib/`; command handlers import them directly.

## Architecture

- Commands depend on shared services; shared services do not import commands.
```

Do not copy this example as a default layout. Derive paths and dependency rules from the target repository.

## Scope and Format

Keep this file about file organization, naming, import patterns, module boundaries, and verified architectural decisions. Product purpose belongs in `product.instructions.md`; runtimes, tools, and commands belong in `tech.instructions.md`.

Keep the body in Markdown. Do not omit the required frontmatter or silently change the filename. Do not explain how to enable instructions.

## Common Mistakes

| Mistake                                                                           | Better approach                                                                                      |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Turning a conventional folder proposal into claimed current architecture          | Describe only existing paths as current; label proposals separately and ask before asserting intent. |
| Treating folder names as proof of module responsibilities or dependency direction | Inspect representative implementations and imports.                                                  |
| Repeating stale structure docs despite conflicting source                         | Reconcile with current files and ask about unresolved architectural intent.                          |
| Listing every file or imposing a complete template                                | Document only stable, useful boundaries and conventions.                                             |
