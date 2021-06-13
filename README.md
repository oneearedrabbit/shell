# diggy

Diggy is a playground that runs practical and recreationcal
programming languages in a sandbox. zero setup, click a link, and you
are ready to go.

## install

this repo is a silly monorepo using nodejs and python. you'll need
to install some dependencies first.

```bash
npm install -g yarn
pip install flake8
```

## nsjail

typically, you won't be running nsjail on a host machine, but if you
really have to this might be helpful. however, keep in mind that
sandbox.cfg is created for docker file system and it may not work for
you as is.

```bash
sudo mkdir /sys/fs/cgroup/{pids,memory}/NSJAIL
sudo chmod u+s /usr/local/bin/nsjail
nsjail --quiet --config sandbox.cfg -- /usr/local/bin/python
```

## development

install development environment:

```bash
yarn
yarn format
yarn lint
```

## run

```bash
docker-compose build
docker-compose up
```

## todo

Disclaimer: Diggy's code base is not in the best shape at the moment,
it was put as a weekend project, and it does require a massive clean
up.

todo:
  - [ ] massive cleanup
  - [ ] add more languages
  - [ ] do nginx config
  - [ ] add static pages
  - [ ] full-height repl
  - [ ] drop a message
  - [ ] TLS

  - [ ] /snap/@username for temporary userlands
  - [ ] readonly userlands
  - [ ] optimize Dockerfile.repl

## configure digitalocean instance

- $10/mo + backups + volume
- harden ssh configuration
- create a new user, protect root
- install fail2ban
- install docker
- install do-agent
- install nginx

- setup 4 domains: www/@, ws, and sandbox
