#!/bin/bash

VERSION=$1

docker build -t "bancodehoras:$VERSION" --network=host "$PWD"

docker rm -f bancodehoras

docker run -itd --name bancodehoras\
  -p "$PORT:8080"\
  --restart "always"\
  "bancodehoras:$VERSION"