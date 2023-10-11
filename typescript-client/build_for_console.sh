#!/bin/bash

set -e

. utils.sh

npx --yes openapi-typescript-codegen \
  --input ../server/openapi.yaml \
  --output ./src \
  --useOptions \
  --useUnionTypes


cp client.ts src/

populate_client_env

echo 'export { getToken } from "./client";' >> src/index.ts

rm -rf ../console/src/lib/services/gen-api
# important: gen-api folder must be in .gitignore since we don't want to commit it.
cp -R ./src ../console/src/lib/services/gen-api
