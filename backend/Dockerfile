FROM node:24-slim

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

RUN npm install --loglevel error --omit=dev

COPY --chown=node:node . .

RUN mkdir -p ./logs && chown -R node:node ./logs

EXPOSE ${LISTEN_PORT:-"3030"}

HEALTHCHECK --interval=5m --start-period=1m CMD node ./healthcheck.js

USER node

CMD ["npm", "run", "start"]
