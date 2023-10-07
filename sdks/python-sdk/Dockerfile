FROM python:3.12.0-alpine3.18

RUN apk add --no-cache	\
	curl \
	poetry

ENV PATH="${PATH}:/root/.local/bin"

COPY . .

COPY ./scripts/docker-entrypoint.sh /entrypoint.sh

ENTRYPOINT ["sh", "/entrypoint.sh"]
