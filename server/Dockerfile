FROM node:20-alpine3.17 as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN npm prune --production

FROM oven/bun:1.0 as release

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

COPY --from=build /app/scripts/docker-entrypoint.sh docker-entrypoint.sh

ENTRYPOINT [ "sh", "docker-entrypoint.sh" ]
