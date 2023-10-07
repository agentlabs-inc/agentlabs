#! /bin/sh

set -e

validate_env() {
	if [ -z "$NPM_TOKEN" ]; then
		echo "NPM_TOKEN is not set, exiting"
		exit 1
	fi
}

prepare_config() {
	sed -i "s/\"version\": \".*\"/\"version\": \"$VERSION\"/g" package.json
	echo "Configured package.json version to $VERSION"
}

validate_env

if [ -z "$VERSION" ]; then
	echo "VERSION is not set, skipping package.json configuration"
	exit 1
else
	prepare_config
fi

echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc

npm ci
npm run build

npm publish --access public
