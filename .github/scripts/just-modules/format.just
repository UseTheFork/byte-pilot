set positional-arguments

[doc('Format files')]
format *args:
    @cd {{ justfile_directory() }} && pnpm fmt "$@"
