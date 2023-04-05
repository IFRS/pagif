const { logger } = require('~/logger');
const DB = require('../index');
const Usuario = require('../models/Usuario');
const args = process.argv.slice(2);

const email = args[0];

Usuario.findOneAndUpdate({ email: email }, { email: email, abilities: [{ action: 'manage', subject: 'all' }] }, { upsert: true }, function(err, usuario) {
  if (err) logger.error('Erro ao buscar ou adicionar um Superadmin: %o', error);

  if (usuario === null) {
    console.log('Super Admin criado com sucesso!');
  } else {
    console.error('Super Admin já cadastrado.');
  }

  DB.close();
  process.exit();
});
