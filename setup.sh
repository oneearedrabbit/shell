#!/bin/bash

echo "Changing /userland to match sandbox environment..."
# I don't know (or cannot) change owner of /userland in
# docker-compose.yml. Managing this on the host system
sudo chown -R 65534:65534 userland/
