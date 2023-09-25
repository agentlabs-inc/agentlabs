FROM caddy:2.7.4-alpine

RUN apk add --no-cache bash

COPY ./docker-entrypoint.sh /docker-entrypoint.sh
COPY ./templates /config-templates

ENTRYPOINT ["sh", "/docker-entrypoint.sh"]
