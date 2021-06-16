# Diggy

Diggy is a playground that runs practical and recreationcal
programming languages in a sandbox. It is a zero setup environment,
click a link, and you are ready to go.

## Install

This repo is a silly monorepo using Node.JS and Python. You will need
to install some dependencies first.

```bash
npm install -g yarn
pip install flake8
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

## Run

```bash
./init-letsencrypt.sh

# for production, make change to ./init-letsencrypt.sh such
# as email address, domains, delete exit statement
# review domains in ./config/diggy.conf

cp .env.dev .env
# adjust .env configuration

docker-compose build
docker-compose up
```

## TODO

Disclaimer: Diggy's code base is not in the best shape at the moment,
it was put as a weekend project, and it does require a massive clean
up.

TODO:
  - [ ] fix overlapping ui
  - [ ] mathplotlib example
  - [ ] add plausible

  - [ ] massive cleanup
  - [ ] full-height repl
  - [ ] /snap/@username for temporary userlands
  - [ ] readonly userlands
  - [ ] optimize Dockerfile.repl
  - [ ] split up web and socket containers

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
- adjust ./config/diggy.conf, and ./init-letsencrypt.sh per your setup
  (specifically replace diggy.test to whatever makes more sense)
- run ./init-letsencrypt.sh
- run ./setup.sh
