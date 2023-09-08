# Agentlabs POC

A repository holding the first proof of concept for Agentlabs.

## Getting started

### Configure environment

Copy env sample to a proper `.env` file:

```shell
cp .env.example .env
```

In the copied file fill the missing values or change defaults as needed.

### Development

```shell
docker compose -f docker-compose.dev.yml up --build -d
```

In development mode both the frontend and server folds will be bind-mounted inside their respective docker containers.
That means that any change made on the local filesystem will reload the running application.

For the svelte frontend, note that this can slow down things if you are not running Linux as the filesystem instructions have to be translated.
In case that's not manageable running the frontend separately and connecting it to the server manually is probably the best alternative.

### Production

```shell
docker compose up --build -d
```
