FROM python:3.11-slim-bookworm

RUN apt-get update && apt-get install -y \
	curl \
	build-essential

RUN sh -c "curl -sSL https://install.python-poetry.org | python3 -"

ENV PATH="${PATH}:/root/.local/bin"

COPY . .

RUN poetry build

ENTRYPOINT ["poetry"]
