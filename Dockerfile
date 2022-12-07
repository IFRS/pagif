FROM node:16-alpine

WORKDIR /home/node/app

RUN apk update && apk upgrade
RUN apk add git

RUN git clone https://github.com/IFRS/pagif.git /home/node/app

RUN npm --logevel=error install
RUN npm run build
