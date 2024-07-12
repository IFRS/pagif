const DB = require('../index');
const Usuario = require('../models/Usuario');
const args = process.argv.slice(2);

const email = args[0];

Usuario.findOneAndUpdate({ email: email }, { email: email, abilities: [{ action: 'manage', subject: 'all' }] }, { upsert: true }, async function(err, usuario) {
  if (err) console.error('Erro ao buscar ou adicionar um Superadmin: ', err)

  if (usuario === null) {
    console.log('Super Admin criado com sucesso!');
  } else {
    console.error('Super Admin já cadastrado.');
  }

  await DB.close();
});
