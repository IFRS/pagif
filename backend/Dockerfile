FROM node:18-alpine

# USER node

WORKDIR /home/node/app

COPY . .

RUN npm --loglevel error install

USER node

EXPOSE ${LISTEN_PORT:-"3030"}

# HEALTHCHECK --interval=5m --start-period=1m CMD node ./healthcheck.js

CMD ["npm", "run", "start"]
