#!/bin/bash
set -e

echo "Generating typescript client..."

cd typescript-client
sh ./build.sh

echo "Typescript client generated!"