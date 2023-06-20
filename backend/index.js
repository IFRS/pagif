require('dotenv').config();
const { fork } = require('child_process');
const api = require('./api');

let fila = fork('./queue/process.js');

fila.on('close', (code) => {
  console.log(`Fila terminada com o código: ${code}`);
});

const port = process.env.LISTEN_PORT || '3030';

api.listen(port, () => {
  console.log(`API rodando na porta ${port}`)
});
