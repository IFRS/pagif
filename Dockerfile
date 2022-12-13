FROM node:16-alpine AS build

WORKDIR /home/node/app

COPY . .

RUN npm --loglevel error install
RUN npm run build

FROM node:16-alpine AS app

USER node

WORKDIR /home/node/app

COPY --from=build --chown=node /home/node/app/.env* ./

COPY --from=build --chown=node /home/node/app/package*.json ./
COPY --from=build --chown=node /home/node/app/nuxt.config.js ./

COPY --from=build --chown=node /home/node/app/.nuxt ./.nuxt
COPY --from=build --chown=node /home/node/app/api ./api
COPY --from=build --chown=node /home/node/app/db ./db
COPY --from=build --chown=node /home/node/app/node_modules ./node_modules
COPY --from=build --chown=node /home/node/app/static ./static

CMD [ "npm", "run", "start" ]
