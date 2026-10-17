---
name: Laravel Inertia Pages
description: "Use when implementing Laravel web controllers that render Inertia pages. Covers component naming, page props, response types, and the distinction between page, API, and redirect responses."
applyTo: "packages/orchestration/app/**/Http/Controllers/**/*.php"
---

# Laravel Inertia Pages

- Use Inertia for Laravel web actions that serve React pages. Return `Inertia::render()` from the action; keep API endpoints as JSON responses and mutation actions on the existing redirect/flash pattern.
- Name the page component using its path relative to `resources/js/pages`, with forward slashes and the existing lowercase, kebab-case convention. For example, `Inertia::render('external-jobs/index', ...)` resolves to `resources/js/pages/external-jobs/index.tsx`.
- Pass page data as a keyed props array. Use camelCase prop names and keep them aligned with the corresponding page's TypeScript `Props` interface. If a page needs no props, call `Inertia::render('home/index')` without an empty array.
- Return `Inertia\Response` from actions that render a page and declare the return type, importing `Inertia\Response` as needed.
- Send only data the page needs and is authorized to receive. When passing models or collections directly, check their serialized attributes and loaded relationships; use an explicit shape when the page needs a limited or purpose-built payload.
- For create, update, and delete actions, follow the local Inertia redirect pattern (`to_route()` or `back()`, with flash data where appropriate) instead of rendering a page directly from the mutation response.
