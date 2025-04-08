#!/usr/bin/env bash

docker run \
  --name groupwork-pg \
  --rm \
  -e POSTGRES_USER=local-dev \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=local \
  -p 5432:5432 \
  -v ./prisma/dev:/var/lib/postgresql/data \
  postgres
