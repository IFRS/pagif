import process from 'node:process';
import pulse from './index.js';
import { logger } from '../logger/index.js';

(async function () {
  logger.info(`[Fila] Início do subprocesso com PID ${process.pid}.`);
  await pulse.start();
})();

async function graceful(signal) {
  await pulse.stop();

  const code = signal instanceof Error ? 1 : 0;
  process.exitCode = code;
}

process.on('SIGHUP', graceful);
process.on('SIGINT', graceful);
process.on('SIGTERM', graceful);

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`[Fila] Erro não tratado em: ${promise} Razão: ${reason}`);
  graceful(reason);
});

process.on('uncaughtException', (error) => {
  logger.error(`[Fila] Exceção não capturada: ${error}`);
  graceful();
});
