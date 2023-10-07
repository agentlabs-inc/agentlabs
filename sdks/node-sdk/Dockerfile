FROM node:20-alpine3.17 as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

ENTRYPOINT [ "sh", "docker-entrypoint.sh" ]
