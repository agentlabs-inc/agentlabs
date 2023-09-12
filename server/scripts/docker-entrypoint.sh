#! /bin/sh

set -e

npx prisma migrate deploy

npm run start:prod
