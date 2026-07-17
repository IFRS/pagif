FROM node:24-slim

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

USER node

RUN npm install --loglevel error --omit=dev

USER root

COPY --chown=node:node . .

RUN mkdir -p ./logs && chown -R node:node ./logs

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod 755 /usr/local/bin/docker-entrypoint.sh

EXPOSE ${LISTEN_PORT:-"3030"}

HEALTHCHECK --interval=5m --start-period=1m CMD node ./healthcheck.js

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["npm", "run", "start"]
