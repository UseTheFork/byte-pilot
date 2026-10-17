set positional-arguments

[doc('Lint backend files')]
backend *args:
    @cd {{ justfile_directory() }}/packages/orchestration && mago lint "$@"


[doc('Lint frontend files')]
frontend *args:
    @cd {{ justfile_directory() }}/packages/orchestration && pnpm lint:fix "$@"
