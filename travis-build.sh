#!/bin/sh

set -ex

env | grep TRAVIS | sort

# Are we on master?
ONMASTER=

if [ \( "$TRAVIS_BRANCH" = "master" \) -a \( "$TRAVIS_PULL_REQUEST" = "false" \) ]; then
    ONMASTER=yes
fi

# Syntactic sugar really...
onmaster () {
    test -n "$ONMASTER"
}

if onmaster; then
    git checkout ${TRAVIS_BRANCH}
fi

# Perform the build
docker build -t datawire/ambassador-auth-service:latest .
docker tag datawire/ambassador-auth-service:latest datawire/ambassador-auth-service:$COMMIT

if onmaster; then
    # Avoid `set -x` leaking secret info into Travis logs
    set +x
    echo "+docker login..."
    docker login -u "${DOCKER_USERNAME}" -p "${DOCKER_PASSWORD}"
    set -x
    docker push datawire/ambassador-auth-service:latest
    docker push datawire/ambassador-auth-service:$COMMIT
else
    echo "not on master; not pushing to Docker Hub"
fi
