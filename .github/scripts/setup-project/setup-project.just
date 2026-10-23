set positional-arguments

setup-project *args:
    @node "{{ justfile_directory() }}/.github/scripts/setup-project/setup.cjs" "$@"

test-setup-project:
    @node --test "{{ justfile_directory() }}/.github/scripts/setup-project/setup.test.cjs"
