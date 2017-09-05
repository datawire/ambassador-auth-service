VERSION=$(shell python -c 'import json; print(json.load(open("package.json", "r"))["version"])')

all: docker-image

docker-image: check-registry
	docker build -t $(DOCKER_REGISTRY)/ambassador-auth-service:$(VERSION) .
	docker push $(DOCKER_REGISTRY)/ambassador-auth-service:$(VERSION)

check-registry:
	@if [ -z "$(DOCKER_REGISTRY)" ]; then \
		echo "DOCKER_REGISTRY must be set" >&2; \
		exit 1; \
    fi
