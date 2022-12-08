FROM node:16-alpine AS build

RUN apk update
RUN apk upgrade
RUN apk add git

WORKDIR /home/node/app

RUN git clone --quiet https://github.com/IFRS/pagif.git ./

RUN npm --logevel=error install
RUN npm run build

FROM node:16-alpine

USER node

WORKDIR /home/node/app

COPY --from=build --chown=node /home/node/app ./

CMD [ "npm", "run", "start" ]
