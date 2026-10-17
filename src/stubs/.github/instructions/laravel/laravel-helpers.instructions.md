---
name: Laravel Helper Preference
description: "Use when writing or reviewing Laravel application code. Prefer Laravel helper functions and framework APIs over native PHP equivalents when they express intent clearly and preserve behavior."
applyTo: "packages/orchestration/app/**"
---

# Laravel Helper Preference

- Prefer Laravel helper functions and framework APIs over equivalent native PHP code when they make the intent clearer and preserve the required behavior.
- Before implementing common framework-aware behavior manually, consider helpers such as `blank()` and `filled()` for blank-value checks, `data_get()` for nested data access, `collect()` for collection pipelines, `config()` for configuration, `app()` for container resolution, and `now()` for the current time.
- Check the helper's exact semantics before replacing native code. In particular, null, false, empty strings, zero, missing array keys, and missing nested values may be treated differently by different helpers.
- Keep native PHP when it is more precise, clearer, avoids unnecessary framework coupling, or is required for exact language-level behavior. Do not replace native functions mechanically or introduce Laravel helpers without a concrete readability or framework-integration benefit.
