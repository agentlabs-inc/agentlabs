#! /bin/sh

set -e

node dist/main.js $@ > /dev/null

cat ./openapi.yaml
