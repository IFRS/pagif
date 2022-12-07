FROM node:lts-alpine

RUN mkdir -p /usr/src/pagif
WORKDIR /usr/src/pagif

RUN apk update && apk upgrade
RUN apk add git

RUN git clone https://github.com/IFRS/pagif.git .

RUN npm install
RUN npm run build
