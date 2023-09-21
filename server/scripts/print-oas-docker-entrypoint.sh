#! /bin/sh

set -e

SKIP_ENV_VALIDATION=true DRY_RUN=true node dist/main.js $@ > /dev/null

cat ./openapi.yaml
