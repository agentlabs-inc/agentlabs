#! /bin/bash

set -e

echo "🚀 Generating typescript client for console..."

npx --yes openapi-typescript-codegen \
  --input ../../server/openapi.yaml \
  --output ./src \
  --useOptions \
  --useUnionTypes

cp client.ts src/

OPENAPI_BASE=${OPENAPI_BASE:-http://localhost:3001}

echo 'Setting environment variables for OpenAPI_BASE:' ${OPENAPI_BASE}
echo "OpenAPI.BASE = '${OPENAPI_BASE}';" >> src/client.ts

echo 'export { getToken } from "./client";' >> src/index.ts

rm -rf ../../console/src/lib/services/gen-api
# important: gen-api folder must be in .gitignore since we don't want to commit it.
cp -R ./src ../../console/src/lib/services/gen-api

echo -e "✅ Done!\n"
