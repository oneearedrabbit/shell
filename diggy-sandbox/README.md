# sandbox

this code is largerly based on snekbox project
<https://github.com/python-discord/snekbox>

## architecture

Python sandbox runners for executing code in isolation aka sandbox.

A client sends Python code to a sandbox, the sandbox executes the
code, and finally the results of the execution are returned to the
client.

```
          +-------------+           +-----------+
 input -> |             |---------->|           | >----------+
          |  HTTP POST  |           |  SANDBOX  |  execution |
result <- |             |<----------|           | <----------+
          +-------------+           +-----------+
             ^                         ^
             |                         |- Executes python code
             |                         |- Returns result
             |                         +-----------------------
             |
             |- HTTP POST Endpoint receives request and returns result
             +---------------------------------------------------------

```

The code is executed in a Python process that is launched through
[NsJail], which is responsible for sandboxing the Python process.

The output returned by sandbox is truncated at around 1 MB.

## HTTP REST API

Communication with sandbox is done over a HTTP REST API. By default,
the server is hosted on `0.0.0.0:8060` with two workers.

## Running sandbox

container can be started with the following command, which will also
pull the image if it doesn't currently exist locally:

```
docker-compose build sandbox
docker-compose up sandbox
```

The above command will make the API accessible on the host via
`http://localhost:8060/`. Currently, there's only one endpoint:
`http://localhost:8060/eval`.

## Configuration

Configuration files can be edited directly. However, this requires
rebuilding the image. Alternatively, a Docker volume or bind mounts
can be used to override the configuration files at their default
locations.

### NsJail

The main features of the default configuration are:

* Time limit
* Memory limit
* Process count limit
* No networking
* Restricted, read-only filesystem

NsJail is configured through [`sandbox.cfg`]. It contains the exact
values for the items listed above. The configuration format is defined
by a [protobuf file][7] which can be referred to for
documentation. The command-line options of NsJail can also serve as
documentation since they closely follow the config file format.

### Gunicorn

[Gunicorn settings] can be found in [`gunicorn.conf.py`]. In the
default configuration, the worker count and the bind address are
likely the only things of any interest. Since it uses the default
synchronous workers, the [worker count] effectively determines how
many concurrent code evaluations can be performed.

### Environment Variables

All environment variables have defaults and are therefore not required
to be set.

Name | Description
---- | -----------
`DEBUG` | Enable debug logging if set to a non-empty value.
`NSJAIL_CFG` | Path to the NsJail configuration file.
`NSJAIL_PATH` | Path to the NsJail binary.

Note: relative paths are relative to the root of the repository.

## Third-party Packages

By default, the Python interpreter has no access to any packages
besides the standard library. Even sandbox's own dependencies like
Falcon and Gunicorn are not exposed.

To expose third-party Python packages during evaluation, install them
to a custom user site:

```sh
docker exec sandbox /bin/sh -c 'PYTHONUSERBASE=/sandbox/user_base pip install numpy'
```

In the above command, `sandbox` is the name of the running
container. The name may be different and can be checked with `docker
ps`.

The packages will be installed to the user site within
`/sandbox/user_base`. To persist the installed packages, a volume for
the directory can be created with Docker. For an example, see
[`docker-compose.yml`].

If `pip`, `setuptools`, or `wheel` are dependencies or need to be
exposed, then use the `--ignore-installed` option with pip. However,
note that this will also re-install packages present in the custom
user site, effectively making caching it futile. Current limitations
of pip don't allow it to ignore packages extant outside the
installation destination.

## Development Environment

[`gunicorn.conf.py`]: config/gunicorn.conf.py
[`sandbox.cfg`]: config/sandbox.cfg
[`docker-compose.yml`]: docker-compose.yml
[`docker run`]: https://docs.docker.com/engine/reference/commandline/run/
[nsjail]: https://github.com/google/nsjail
[falcon]: https://falconframework.org/
[gunicorn]: https://gunicorn.org/
[gunicorn settings]: https://docs.gunicorn.org/en/latest/settings.html
[worker count]: https://docs.gunicorn.org/en/latest/design.html#how-many-workers
