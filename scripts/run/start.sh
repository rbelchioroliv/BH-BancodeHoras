#!/bin/bash

VERSION=$1

docker build -t "bancodehoras:$VERSION" --network=host "$PWD"

docker rm -f bancodehoras-t2

docker run -itd --name bancodehoras-t2\
  -p "$PORT:8080"\
  --restart "always"\
  "bancodehoras:$VERSION"
