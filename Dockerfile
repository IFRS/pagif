FROM node:lts-alpine

RUN mkdir -p /usr/src/pagif
WORKDIR /usr/src/pagif

RUN apk update && apk upgrade
RUN apk add git

COPY . /usr/src/pagif/
RUN npm install
RUN npm run build
