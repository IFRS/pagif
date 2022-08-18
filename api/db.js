const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(`mongodb://${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro na Conexão:'));

module.exports = db;
