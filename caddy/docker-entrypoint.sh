#! /bin/sh

set -e
set -x

if [ -z "$AGENTLABS_URL" ]; then
  echo "AGENTLABS_URL is not set"
  exit 1
fi

echo $AGENTLABS_CONSOLE_URL

if [ -z "$AGENTLABS_CONSOLE_URL" ]; then
	cat /config-templates/all-in-one.Caddyfile | sed "s/{{AGENTLABS_URL}}/$AGENTLABS_URL/g" > /config/Caddyfile
else
	cat /config-templates/separated-domains.Caddyfile	\
	| sed "s/{{AGENTLABS_URL}}/$AGENTLABS_URL/g"		\
	| sed "s/{{AGENTLABS_CONSOLE_URL}}/$AGENTLABS_CONSOLE_URL/g"	\
	> /config/Caddyfile
fi

caddy run --config /config/Caddyfile --adapter caddyfile
