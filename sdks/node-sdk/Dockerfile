FROM node:20-alpine3.17 as build

WORKDIR /app

COPY . .

COPY scripts/docker-entrypoint.sh /entrypoint.sh

ENTRYPOINT [ "sh", "/entrypoint.sh" ]
