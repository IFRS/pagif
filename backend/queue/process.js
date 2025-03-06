import process from 'node:process';
import pulse from './index.js';
import { logger } from '../logger/index.js';

(async function () {
  logger.info(`[Fila] Início do subprocesso com PID ${process.pid}.`);
  await pulse.start();
})();

async function graceful(code = 0) {
  await pulse.stop();
  process.exitCode = code;
}

process.on('SIGHUP', graceful(0));
process.on('SIGINT', graceful(0));
process.on('SIGKILL', graceful(0));
process.on('SIGTERM', graceful(0));

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`[Fila] Erro não tratado em: ${promise} Razão: ${reason}`);
  graceful(1);
});

process.on('uncaughtException', (error) => {
  logger.error(`[Fila] Exceção não capturada: ${error}`);
  graceful(1);
});
