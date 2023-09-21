FROM node:20-alpine3.17 as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

RUN npm prune --production

FROM node:20-alpine3.17 as release

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma

# we do use the special print-oas-docker-entrypoint.sh script here
COPY --from=build /app/scripts/print-oas-docker-entrypoint.sh docker-entrypoint.sh

ENTRYPOINT [ "sh", "docker-entrypoint.sh" ]
