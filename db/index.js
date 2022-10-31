require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`).then(
  () => {
    mongoose.connection
    .on('error', console.error.bind(console, 'Erro no MongoDB:'));
  },
  err => {
    console.error('Erro ao tentar conectar no MongoDB: ' + err);
  }
);

module.exports = mongoose.connection;