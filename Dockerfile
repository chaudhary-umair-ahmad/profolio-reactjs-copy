# syntax=docker/dockerfile:1.4

FROM node:20.13.1-alpine as build

WORKDIR /app

COPY package.json yarn.lock .npmrc .

ENV NODE_ENV=production

RUN --mount=type=secret,id=env_secrets \
    set -a && \
    . /run/secrets/env_secrets && \
    set +a && \
    yarn install

COPY . .
