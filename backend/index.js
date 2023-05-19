require('dotenv').config();
const { fork } = require('child_process');
const api = require('./api');

let fila = fork('./queue/process.js');

fila.on('close', (code) => {
  console.log(`Fila terminada com o código: ${code}`);
});

api.listen(process.env.LISTEN_PORT, () => {
  console.log(`API rodando na porta ${process.env.LISTEN_PORT}`)
});
