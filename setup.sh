#!/bin/bash

# I cannot mount userland volume in docker-compose as 65534:65534,
# doing this manually
sudo chown -R 65534:65534 userland
sudo chown -R 65534:65534 userland_tpl

# Proxy Plausible through Nginx
sudo mkdir -p /var/run/nginx-cache/jscache
sudo chown -R nginx:nginx /var/run/nginx-cache
