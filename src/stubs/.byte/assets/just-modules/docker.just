set positional-arguments

[doc('Test Helm template rendering')]
test-helm:
    @cd {{ justfile_directory() }} && helm template my-release ./chart \
    -f chart/values.yaml \
    -f chart/values.dev.yaml \
    --set nameOverride=ares0155-octorunner-orchestrator \
    --set registry=image-registry.openshift-image-registry.svc:5000 \
    --set componentId=octorunner-orchestrator \
    --set global.nameOverride=ares0155-octorunner-orchestrator \
    --set global.registry=image-registry.openshift-image-registry.svc:5000 \
    --set global.componentId=octorunner-orchestrator \
    --set imageNamespace=ares0155-dev \
    --set imageTag=8d44743a \
    --set global.imageNamespace=ares0155-dev \
    --set global.imageTag=8d44743a \
    --debug

[doc('Build Docker image')]
build:
    #!/usr/bin/env bash
    set -euo pipefail

    cd packages/orchestration && pnpm build
    cd {{ justfile_directory() }}

    docker build \
    --build-arg dockerImageLaravel="laravel:latest" \
    -t ares0155-octorunner-orchestrator:latest .

[doc('Run Docker container')]
run:
    #!/usr/bin/env bash
    set -euo pipefail
    cd {{ justfile_directory() }} && docker run -it --rm --entrypoint /bin/bash ares0155-octorunner-orchestrator:latest
