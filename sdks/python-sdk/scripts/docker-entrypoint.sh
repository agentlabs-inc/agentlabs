#! /bin/sh

set -e

validate_env() {
	if [ -z "$PYPI_USER" ]; then
		echo "PYPI_USER env var is not set, exiting"
		exit 1
	fi

	if [ -z "$PYPI_PASSWORD" ]; then
		echo "PYPI_PASSWORD env var is not set, exiting"
		exit 1
	fi
}

prepare_config() {
	sed -i "s/^version = .*$/version = \"$VERSION\"/" pyproject.toml
	echo "Wrote version to pyproject.toml ($VERSION)"
}

validate_env

if [ -z "$VERSION" ]; then
	echo "VERSION env var is not set, will use pyproject.toml version unmodified."
else
	prepare_config
fi

poetry publish --build			\
	--no-interaction			\
	--build						\
	--username "$PYPI_USER"	\
	--password "$PYPI_PASSWORD"	
