set positional-arguments

workspace *args:
    @node "{{ justfile_directory() }}/.github/scripts/int-subagent-driven-dev/workspace.cjs" "$@"

test-workspace:
    @node --test "{{ justfile_directory() }}/.github/scripts/int-subagent-driven-dev/helpers.test.cjs"
