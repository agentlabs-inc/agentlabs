#!/bin/bash
set -e

npx --yes openapi-typescript-codegen \
  --input ../server/openapi.yaml \
  --output ./src \
  --useOptions \
  --useUnionTypes


cp client.ts src/
echo 'export { getToken } from "./client";' >> src/index.ts

# important: gen-api folder must be in .gitignore since we don't want to commit it.
cp -R ./src ../console/src/lib/services/gen-api