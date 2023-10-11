#! /bin/bash

function populate_client_env() {
	OPENAPI_BASE=${OPENAPI_BASE:-http://localhost:3001}

	echo 'Setting environment variables for OpenAPI_BASE:' ${OPENAPI_BASE}
	echo "OpenAPI.BASE = '${OPENAPI_BASE}';" >> src/client.ts
}
