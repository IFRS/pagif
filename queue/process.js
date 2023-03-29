const agenda = require('./index');
const { logger } = require('../logger');

(async function() {
  logger.info(`[Fila] Início do processo com PID ${process.pid}.`);
  await agenda.start();
})();

async function graceful() {
  await agenda.stop();
  process.exit(0);
}

process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);
