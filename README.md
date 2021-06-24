# Diggy

Diggy is a playground that runs practical and recreationcal
programming languages in a sandbox. It is a zero setup environment,
click a link, and you are ready to go.

![Diggy screenshot](https://raw.githubusercontent.com/diggyhq/shell/master/public/image.png)

## Install

This repo is a silly monorepo using Node.JS and Python. You will need
to install some dependencies first.

```bash
npm install -g yarn
pip install flake8 black
```

## NSJail

Typically, you won't be running nsjail on a host machine, but if you
really have to this might be helpful. Keep in mind that sandbox.cfg is
created for docker file system and it may not work for you as is.

```bash
sudo mkdir /sys/fs/cgroup/{pids,memory}/NSJAIL
sudo chmod u+s /usr/local/bin/nsjail
nsjail --quiet --config sandbox.cfg -- /usr/local/bin/python
```

## Development

Install development environment:

```bash
yarn
yarn format
yarn lint
```

If you want to develop Diggy locally without `docker-compose`, you
will need to adjust `.env` file to something like this. nsjail won't
make it easier, so for the time being I recommend running at least two
containers: `nginx` and `sandbox`.

```
VM_PATH=/userland
HOST=0.0.0.0
WEB_HOST=http://diggy.test:3000
VITE_WS_HOST=http://diggy.test:5000
VITE_SANDBOX_HOST=http://sandbox.diggy.test
VITE_SANDBOX_HOST_LOCAL=http://sandbox.diggy.test
```

Make sure to add hosts to `/etc/hosts`:
```
127.0.0.1 diggy.test
127.0.0.1 ws.diggy.test
127.0.0.1 sandbox.diggy.test
```

It should be enough to get frontend up and running:
```
cd diggy-repl
yarn dev
yarn server
```

## Run

```bash
./init-letsencrypt.sh
./setup

# for production, make change to ./init-letsencrypt.sh such
# as email address, domains, delete exit statement
# review domains in ./config/diggy.conf

cp .env.dev .env
cp .env.smtp.dev .env.smtp
# adjust .env and .env.smtp configuration

docker-compose build
docker-compose up
```

## TODO

Disclaimer: Diggy's code base is not in the best shape at the moment,
it was put as a weekend project, and it does require a massive clean
up.

See
[ROADMAP.md](https://github.com/diggyhq/shell/blob/master/ROADMAP.md)
for more detail.

## Configure DigitalOcean instance

- $10/mo + backups + volume
- harden ssh configuration
- create a new user, add to sudoers, protect root
- install fail2ban
- install docker & docker-compose
- install do-agent

- setup 4 domains: www/@, ws, and sandbox
- (local) add domains to /etc/hosts
- (local) FireFox is going to complain about dummy certificates, visit
  each test domain to acknowledge security risks. Otherwise, CORS will fail
- replace ./config/diggy.dev.conf to ./config/diggy.conf in docker-compose.yml
- adjust ./config/diggy.conf, and ./init-letsencrypt.sh per your setup
  (specifically replace diggy.test to whatever makes more sense)
- run ./init-letsencrypt.sh
- run ./setup.sh
