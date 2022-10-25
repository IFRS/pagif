const mongoose = require('mongoose');
require('dotenv').config();

let db = null;

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`).then(
  () => {
    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Erro no MongoDB:'));
  },
  err => {
    console.error('Erro ao tentar conectar: ' + err);
  }
);

module.exports = db;
