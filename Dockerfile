FROM node:16-alpine AS build

RUN apk update && apk upgrade && apk add git

WORKDIR /home/node/app

RUN git clone --quiet --depth 1 https://github.com/IFRS/pagif.git ./

RUN npm --logevel=error install
RUN npm run build

RUN rm -Rf .git/ .editorconfig .env.examaple .eslintrc .gitignore docker-compose.json Dockerfile README.md

FROM node:16-alpine

USER node

WORKDIR /home/node/app

COPY --from=build --chown=node /home/node/app ./

CMD [ "npm", "run", "start" ]
