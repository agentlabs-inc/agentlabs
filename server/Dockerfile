FROM node:20-alpine3.17 as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm prune --production

FROM node:20-alpine3.17

WORKDIR /app

COPY docker-entrypoint.sh docker-entrypoint.sh

COPY --from=build-stage /app/package*.json ./
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/migrations ./migrations

ENTRYPOINT ["sh", "docker-entrypoint.sh"]
