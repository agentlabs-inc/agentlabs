#! /bin/sh

set -e

npm install

npx prisma generate
npx prisma migrate deploy

npm run start:dev
