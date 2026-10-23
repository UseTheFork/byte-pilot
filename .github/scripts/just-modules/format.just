set positional-arguments

[doc('Format frontend files')]
frontend *args:
    @cd {{ justfile_directory() }} && pnpm format:fix "$@"

[doc('Format backend files')]
backend *args:
    @cd {{ justfile_directory() }} && mago --config {{ justfile_directory() }}/mago.toml format "$@"
