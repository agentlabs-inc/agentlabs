all:
	@echo "make frontend-clients"
	@echo "make openapi"

frontend-clients: openapi
	cd scripts/frontend-clients && ./build_for_frontend.sh
	cd scripts/frontend-clients && ./build_for_console.sh
.PHONY: build-frontend-clients

openapi:
	docker build -f ./server/print-oas.Dockerfile -t print-oas ./server
	docker run --rm print-oas > ./server/openapi.yaml
	docker rmi print-oas
.PHONY: gen-oas
