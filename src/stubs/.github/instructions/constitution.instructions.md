---
name: Project Constitution
description: "Repository-wide development principles and governance. Consider for every task, including planning, implementation, review, and tooling changes. Covers architecture, reuse, testing, strict typing, and compliance."
applyTo: "packages/**"
---

# Project Constitution

These rules apply to every file under `packages/`. Apply technology-specific guidance only when it matches the file being changed; do not force Laravel conventions onto frontend or other package code.

## Principles

### I. Domain-Driven Design

All business logic lives inside bounded-context directories under `app/Domain/`. Each domain directory (e.g. `app/Domain/Feature/`, `app/Domain/Orchestration/`, `app/Domain/ExclusionList/`) encapsulates its own Models, Http (Controllers, Requests, Resources), Services, Jobs, Enums, and routes. Cross-domain imports must flow through explicit public interfaces (service classes or contracts) — never reach into another domain's internals. Shared, domain-agnostic infrastructure (middleware, base controllers, utilities, the application service provider) resides in `app/Domain/Core/`. If logic applies to more than one domain but is not domain-specific, it belongs in `app/Domain/Core/`; otherwise it belongs in the owning domain directory.

### II. Don't Repeat Yourself

Duplicated logic must be extracted into a single authoritative location. Shared PHP utilities, base classes, middleware, and cross-cutting concerns belong in `app/Domain/Core/`. Shared frontend components, hooks, and utilities belong in `resources/js/components/`, `resources/js/hooks/`, and `resources/js/utils/` respectively. Before creating any new abstraction, verify that equivalent functionality does not already exist in these shared locations. Premature abstraction is avoided — extract only when duplication is proven (two or more concrete usages).

### III. Test-Driven Development

All backend logic must be covered by tests written with Pest (PHP). Tests reside in `tests/`, mirroring the domain structure under `tests/Domain/`. Base test infrastructure is provided by `tests/TestCase.php` and `tests/Pest.php`. New features and bug fixes require accompanying test coverage before merge. Tests must be deterministic, isolated, and must not depend on external services without mocking. Frontend testing is not currently mandated.

### IV. Strict Typing

Every PHP file must begin with `declare(strict_types=1);`. All PHP function and method signatures must include explicit parameter type declarations and return type declarations. Union types and nullable types are permitted where semantically appropriate; `mixed` is discouraged and must be justified. On the frontend, TypeScript strict mode is enabled in `tsconfig.json`. All TypeScript code must use explicit type annotations. The use of `any` is prohibited unless accompanied by a comment justifying the exception. Implicit type coercion must be avoided in both languages.

## Governance

### Supremacy

This constitution is the highest-authority document governing development practices in this repository. All code contributions, architectural decisions, and tooling changes must conform to the principles and standards defined herein. In case of conflict between this constitution and any other project documentation, this constitution prevails. Exceptions require an explicit amendment to this document following the versioning policy below.

### Versioning Policy

This constitution follows semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR** (e.g. 1.0.0 → 2.0.0): Breaking changes to core principles or architectural mandates that require existing code to be refactored for compliance.
- **MINOR** (e.g. 0.1.0 → 0.2.0): Addition of new principles, sections, or non-breaking amendments to existing rules.
- **PATCH** (e.g. 0.1.0 → 0.1.1): Clarifications, typo fixes, or formatting changes that do not alter the meaning of any rule.

**Compliance Review**: All code reviews should verify adherence to this constitution. Persistent or systemic violations should trigger a team discussion to determine whether the constitution needs amendment or whether enforcement practices need strengthening.

---

Last Amended: 2026-06-15
Ratified: 2026-06-15
Version: 0.1.0
