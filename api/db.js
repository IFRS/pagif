const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/ifpag');

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro na Conexão:'));
db.once('open', function callback () {
  console.log("MongoDB Conectado...");
});

module.exports = db;
