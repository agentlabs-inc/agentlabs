FROM node:20-alpine3.17 as build

WORKDIR /app

COPY . .

COPY .npmrc /root/.npmrc

COPY scripts/docker-entrypoint.sh /entrypoint.sh

CMD [ "sh", "/entrypoint.sh" ]
