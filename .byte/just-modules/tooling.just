set positional-arguments

pnpm *args:
    @cd {{ justfile_directory() }} && pnpm "$@"

nix-update:
    @cd {{ justfile_directory() }} && nix flake update

git *args:
    @cd {{ justfile_directory() }} && git "$@"

setup:
    @cd {{ justfile_directory() }} && pnpm install
