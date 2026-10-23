set positional-arguments

[doc('run artisan command')]
artisan *args:
    @cd {{ justfile_directory() }}/packages/orchestration && php artisan "$@"

[doc('List schedule')]
schedule:
    @cd {{ justfile_directory() }}/packages/orchestration && php artisan schedule:list
