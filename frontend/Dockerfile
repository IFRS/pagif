FROM node:24-slim AS build

WORKDIR /home/node/app

COPY . .

RUN npm install --loglevel error
RUN npm run build

FROM node:24-slim AS app

USER node

WORKDIR /home/node/app

COPY --from=build --chown=node /home/node/app/.output ./

COPY --from=build --chown=node /home/node/app/healthcheck.js ./

HEALTHCHECK --interval=5m --start-period=1m CMD node ./healthcheck.js

CMD ["node", "server/index.mjs"]
