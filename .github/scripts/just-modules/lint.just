set positional-arguments

[doc('Lint files')]
lint *args:
    @cd {{ justfile_directory() }} && pnpm lint:fix "$@"
