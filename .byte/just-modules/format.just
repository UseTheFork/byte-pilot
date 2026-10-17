set positional-arguments

[doc('Format frontend files')]
frontend *args:
    @cd {{ justfile_directory() }}/packages/orchestration && pnpm oxfmt "$@"

[doc('Format backend files')]
backend *args:
    @cd {{ justfile_directory() }}/packages/orchestration && mago format "$@"
