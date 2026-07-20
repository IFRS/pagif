import 'dotenv/config';
import { fork } from 'node:child_process';
import api from './api/index.js';

const fila = fork('./queue/process.js');

fila.on('error', (error) => {
  console.error(`Erro na fila: ${error}`);
});
fila.on('close', (code) => {
  console.info(`Fila terminada com o código: ${code}`);
});

const port = process.env.LISTEN_PORT || '3030';

const server = api.listen(port, () => {
  console.info(`API rodando na porta ${port}`);
});

function shutdown(signal) {
  console.debug(`Sinal ${signal} recebido: fechando o servidor HTTP e a fila...`);

  fila.kill('SIGTERM');

  server.close(() => {
    console.info('Servidor da API fechado.');
  });
}

process.once('SIGHUP', () => shutdown('SIGHUP'));
process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
