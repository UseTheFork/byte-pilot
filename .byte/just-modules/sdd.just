set positional-arguments

review-package *args:
    @node {{ justfile_directory() }}/.bicx/assets/scripts/sdd/review-package.cjs "$@"

workspace *args:
    @node {{ justfile_directory() }}/.bicx/assets/scripts/sdd/workspace.cjs "$@"

task-brief *args:
    @node {{ justfile_directory() }}/.bicx/assets/scripts/sdd/task-brief.cjs "$@"

worktree-info:
    #!/usr/bin/env bash
    set -euo pipefail

    GIT_DIR=$(cd "{{ justfile_directory() }}" && cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
    GIT_COMMON=$(cd "{{ justfile_directory() }}" && cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
    BRANCH=$(git -C "{{ justfile_directory() }}" branch --show-current)

    printf 'GIT_DIR=%s\nGIT_COMMON=%s\nBRANCH=%s\n' "$GIT_DIR" "$GIT_COMMON" "$BRANCH"
