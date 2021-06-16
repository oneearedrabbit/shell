# Sandbox

This code is largerly based on snekbox project, which has been published under MIT license: <https://github.com/python-discord/snekbox>.

## HTTP REST API

Communication with sandbox is done over a HTTP REST API. By default,
the server is hosted on `0.0.0.0:8060` with two workers.

## Running sandbox

Container can be started with the following command:

```
docker-compose build sandbox
docker-compose up sandbox
```

The above command will make the API accessible on the host via
`http://localhost:8060/`. Currently, there's only one endpoint:
`http://localhost:8060/eval`.

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
Gunicorn are not exposed.

To expose third-party Python packages during evaluation, install them
to a custom user site:

```sh
docker exec sandbox /bin/sh -c 'PYTHONUSERBASE=/opt/python/user_base pip install numpy'
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
[nsjail]: https://github.com/google/nsjail
[gunicorn]: https://gunicorn.org/
[gunicorn settings]: https://docs.gunicorn.org/en/latest/settings.html
[worker count]: https://docs.gunicorn.org/en/latest/design.html#how-many-workers
