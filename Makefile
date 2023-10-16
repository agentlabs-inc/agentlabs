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

check: check-frontend check-backend check-console
.PHONY: check

check-frontend:
	cd frontend && npm run check
.PHONY: check-frontend

check-backend:
	cd server && npm run build
.PHONY: check-backend

check-console:
	cd console && npm run check
.PHONY: check-console
