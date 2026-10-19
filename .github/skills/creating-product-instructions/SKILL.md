---
name: creating-product-instructions
description: Use when creating or updating a repository's `.github/instructions/product.md` product context file for Copilot.
---

# Creating Product Instructions

## Overview

Create a concise, evidence-based product brief that gives Copilot durable context for product decisions. Capture the product's purpose and boundaries, not its technology stack or a speculative roadmap.

## Workflow

1. Inspect the repository before drafting: read its overview and product docs, then check relevant source, tests, user-facing text, and package metadata. Follow links to current product documentation when useful.
2. Separate confirmed facts from inference. Documentation can describe intent; code and tests can confirm implemented behavior, but neither alone establishes the current target market or business status. Check dates and corroboration when sources disagree.
3. Ask the user concise, specific questions when unresolved facts materially affect the product description: who it serves, what need it addresses, its core user jobs, current availability, or important goals and non-goals. Ask now, even under deadline pressure; batch related questions and do not ask about details already established by reliable evidence. If the user is unavailable or does not answer, proceed conservatively and mark material unknowns plainly.
4. Create or update exactly `.github/instructions/product.md`. State only supported facts; never turn a guess into a product claim.
5. Keep the file short and useful to Copilot. Include only relevant, verified context such as:
   - Product purpose and user problem
   - Primary users and their needs
   - Core user jobs or confirmed capabilities
   - Current product status, when known
   - Goals, constraints, and explicit non-goals

Omit sections with no useful evidence. Prefer durable product context over release details, implementation instructions, or aspirational feature lists. Use links to repository sources when they make important claims easier to verify.

## File Format and Scope

Use plain Markdown at the requested `product.md` path; do not invent front matter or silently rename it. VS Code's documented Copilot instruction-file discovery uses `*.instructions.md`, so a plain `product.md` is not automatically attached by that filename convention. If the user expects automatic discovery, surface this limitation and ask before changing the requested path. Do not provide setup instructions for enabling custom instructions.

Keep this file about the product, not frameworks, architecture, coding conventions, or development tooling. Do not duplicate technical guidance that belongs in the next skill.

## Example

When package metadata names a `foo` executable but its description is blank and source is absent, do not claim what the product does. Record only the verified repository facts, ask what users and problem define the product, and leave unsupported capabilities out of the brief.

## Common Mistakes

| Mistake                                                                               | Better approach                                                                                     |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Treating package names, command names, or mock data as confirmed product capabilities | Verify behavior in source, tests, or user-facing documentation; qualify what remains uncertain.     |
| Resolving conflicting docs by choosing the most polished or recent-sounding story     | Check source freshness and corroboration; ask about material conflicts in product intent or status. |
| Filling every heading with guesses to make the file look complete                     | Omit unsupported sections or label the unknown clearly.                                             |
| Mixing product goals with implementation choices                                      | Reserve stack and architecture context for technical guidance.                                      |
| Assuming `product.md` is auto-discovered as a VS Code instruction                     | State the filename limitation; retain the requested path unless the user approves a change.         |

## Required Next Step

After the product file is complete and reviewed, immediately load the `creating-tech-instructions` skill and follow it next. Do not substitute a different skill. If `creating-tech-instructions` is not yet available, report that dependency and stop before creating technical-stack guidance.
