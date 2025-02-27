import 'dotenv/config';
import { fork } from 'node:child_process';
import api from './api/index.js';

let fila = fork('./queue/process.js');

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

process.on('SIGTERM', () => {
  console.debug('Sinal SIGTERM recebido: fechando o servidor HTTP...');
  server.close(() => {
    console.info('Servidor da API fechado.');
  });
});
