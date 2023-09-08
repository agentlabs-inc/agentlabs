FROM node:20-alpine3.17 as build-stage

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

RUN npm prune --production

FROM node:20-alpine3.17

WORKDIR /app

COPY --from=build-stage /app/build build/
COPY --from=build-stage /app/node_modules node_modules/
COPY package.json .

ENV NODE_ENV=production

CMD [ "node", "build" ]
