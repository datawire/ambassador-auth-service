# Ambassador Auth Service

Example auth service for [Ambassador][ag] using [ExtAuth][ae]. See the [Ambassador documentation][aw] for more information.

[ag]: https://github.com/datawire/ambassador
[ae]: https://github.com/datawire/ambassador-envoy
[aw]: http://www.getambassador.io/


## Using the service

The service listens on port 3000 and supports the ExtAuth interaction pattern. In short, the service expects a POST to the path `/ambassador/auth` with client request headers as a JSON map in the POST body. If auth is okay, it returns a 200 to allow the client request to go through. Otherwise it returns a 401 with an HTTP Basic Auth WWW-Authenticate header. Take a look at [ExtAuth][ae] for more information about the Envoy side of things.

The current version of this code only performs auth when the client headers indicate a request under the `/service` path. The only valid credentials are `username:password`. It should be straightforward to extend this sample to perform meaningful auth.


### Run using Node

The example service requires a recent version of Node that supports `const`.

    $ git clone https://github.com/datawire/ambassador-auth-service.git
    Cloning into 'ambassador-auth-service'...
    remote: Counting objects: 36, done.
    remote: Compressing objects: 100% (23/23), done.
    remote: Total 36 (delta 14), reused 29 (delta 11), pack-reused 0
    Unpacking objects: 100% (36/36), done.

    $ cd ambassador-auth-service/

    $ npm install
    added 236 packages in 4.995s

    $ npm start

    > authserver@1.0.0 start /Users/ark3/temp/ambassador-auth-service
    > node server.js

    Example app listening on port 3000!


### Run using Docker

    $ docker pull datawire/ambassador-auth-service:latest
    latest: Pulling from datawire/ambassador-auth-service
    2aecc7e1714b: Pull complete
    8c9904a62f4c: Pull complete
    03e43cd0c4c3: Pull complete
    ea2ca032df77: Pull complete
    cf5c747aca5b: Pull complete
    Digest: sha256:78c46829e124be43a6976fea53a6e120f6c9ce24ef68782bdedf55d7acd4b9c5
    Status: Downloaded newer image for datawire/ambassador-auth-service:latest

    $ docker run -it --rm -p 3000:3000 datawire/ambassador-auth-service:latest

    > authserver@1.0.0 start /src
    > node server.js

    Example app listening on port 3000!


### Run using Kubernetes

This assumes your `kubectl` command is set up to point to your Kubernetes cluster already.

    $ kubectl apply -f example-auth.yaml
    service "example-auth" created
    deployment "example-auth" created

    $ kubectl logs example-auth-2014484287-034kz

    > authserver@1.0.0 start /src
    > node server.js

    Example app listening on port 3000!
