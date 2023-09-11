#! /bin/sh

set -e

function make_pg_connection_string() {
  echo -n "postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}"
}

DATABASE_URL=$(make_pg_connection_string) npm run migrate up

npm run start
