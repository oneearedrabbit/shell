#!/bin/bash

# I cannot mount userland volume in docker-compose as 65534:65534,
# doing this manually
sudo chown -R 65534:65534 userland
