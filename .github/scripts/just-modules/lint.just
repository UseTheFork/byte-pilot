set positional-arguments

[doc('Lint backend files')]
backend *args:
    @cd {{ justfile_directory() }} && mago --config {{ justfile_directory() }}/mago.toml lint --minimum-fail-level "error" --minimum-report-level "help" "$@"


[doc('Lint frontend files')]
frontend *args:
    @cd {{ justfile_directory() }} && pnpm lint:fix "$@"
