const process = require('node:process');
const http = require('http');
require('dotenv').config();

const options = {
  host: 'localhost',
  port: process.env.LISTEN_PORT || '3030',
  timeout: 5000,
};

let request = http.request({ ...options, path: '/health' }, (res) => {
  console.log(`STATUS Geral: ${res.statusCode}`);
  if (res.statusCode !== 200) {
    process.exitCode = 1;
  }
});

request.on('error', function (err) {
  console.error(`ERROR: ${err}`);
  process.exitCode = 1;
});

request.end();
