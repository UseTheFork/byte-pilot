# SDD helper

`sdd::workspace` resolves durable report filenames in the current checkout's `.scratch` directory. It does not create files, change the checkout, or write reports.

```sh
just sdd::workspace --workspace /absolute/checkout \
  --reports-dir .scratch/2026-10-23-feature/reports --ticket 03 [--round 2]
```

The JSON output contains the checkout path, reports directory, and absolute and repository-relative paths for implementation, code review, task review, optional scoped review, final review, and final fix review. Assigned agents may save reports directly at these paths, preserving prior history and coordinating shared-file edits.

Use `just sdd::test-workspace` to test the path resolver with disposable Git repositories.
