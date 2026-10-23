set positional-arguments

[doc('Run tests via pest')]
test *args:
    @cd {{ justfile_directory() }}/packages/orchestration && php artisan test "$@"

[doc('Run the non-browser Dataset graph geometry regression')]
graph-layout:
    @cd {{ justfile_directory() }}/packages/orchestration && node --test resources/js/pages/datasets/dataset-graph-layout.test.mjs

[doc('Run tests with coverage')]
coverage *args:
    @cd {{ justfile_directory() }}/packages/orchestration && ./vendor/bin/pest --coverage "$@"


[doc('Check frontend types')]
types-frontend:
    @cd {{ justfile_directory() }}/packages/orchestration && pnpm check-types

[doc('Check backend types')]
types-backend:
    @cd {{ justfile_directory() }}/packages/orchestration && ./vendor/bin/pest --type-coverage

[doc('Generate frontend types')]
generate-types:
    @cd {{ justfile_directory() }}/packages/orchestration && php artisan wayfinder:generate --with-form
