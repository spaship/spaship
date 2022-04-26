# spa-deployment-operator

This
application
creates
new
environment
and
deploy
spas
into
them,
maintain
and
manage
those
environments'
lifecycle.

## Documentation

For
more
details
on
operator
follow
the [SPAship architecture document](https://spaship.io#operator)

## Configurable Properties

| Name | Description | Default value
| --- | ----------- | ----------- |
|application.k8s.namespace|Required when deployed in k8s cluster, usually computed from namespace file when deployed in pod|empty|
|operator.event.bus.address|Application sends all operational events in this bus. The sse api also consumes this bus and publish events|spa-ops-event-channel|
|operator.domain.name|Required to create the Ingress controller route for environment pods, and this property varies from cluster to cluster based on k8s service provider. |empty|

## Running the application in dev mode

You
can
run
this
application
in
dev
mode
that
enables
live
coding
using:

```shell script
./mvnw compile quarkus:dev
```

## Packaging and running the application

The
application
can
be
packaged
using:

```shell script
./mvnw package
```

It
produces
the `quarkus-run.jar`
file
in
the `target/quarkus-app/`
directory.
Be
aware
that
it’s
not
an _
über-jar_
as
the
dependencies
are
copied
into
the `target/quarkus-app/lib/`
directory.

If
you
want
to
build
an _
über-jar_
,
execute
the
following
command:

```shell script
./mvnw package -Dquarkus.package.type=uber-jar
```

The
application
is
now
runnable
using `java -jar target/quarkus-app/quarkus-run.jar`
.

## Installation using Helm chart in a k8s cluster

Navigate
to
the
spa-deployment-operator
directory
by
executing
this
command
`cd spa-deployment-operator`

and
then
apply
the
following
command

```
helm install \
--set image.repository=quay.io/arbhatta/operator \
--set image.tag=develop \
--set app.domain=<name of the cluster domain> \
--set ingress.host=<name of the cluster domain> \
operator .
```
