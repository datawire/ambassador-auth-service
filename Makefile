VERSION=$(shell python -c 'import json; print(json.load(open("package.json", "r"))["version"])')

.ALWAYS:

all: docker-image example-auth.yaml

docker-image: check-registry
	docker build -t $(DOCKER_REGISTRY)/ambassador-auth-service:$(VERSION) .
	docker push $(DOCKER_REGISTRY)/ambassador-auth-service:$(VERSION)

check-registry:
	@if [ -z "$(DOCKER_REGISTRY)" ]; then \
		echo "DOCKER_REGISTRY must be set" >&2; \
		exit 1; \
    fi

example-auth.yaml: .ALWAYS
	sed -e 's/{{VERSION}}/$(VERSION)/g' \
		-e 's/{{DOCKER_REGISTRY}}/$(DOCKER_REGISTRY)/g' \
		< example-auth.yaml.template > example-auth.yaml
