#!/usr/bin/env bash

docker run \
  --name groupwork-test-pg \
  --rm \
  -e POSTGRES_USER=local-test \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=test \
  -p 5432:5432 \
  -v ./prisma/test:/var/lib/postgresql/data \
  postgres