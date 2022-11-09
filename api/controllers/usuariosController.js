const Usuario = require('../../db/models/Usuario');
const validator = require('express-validator');

module.exports.list = function(req, res) {
  const query = Usuario.find({});

  query.sort('nome');

  query.exec(function(err, usuarios) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Erro obtendo Usuários.',
      });
    }
    return res.json(usuarios.map(doc => doc.toJSON()));
  });
};

module.exports.show = function(req, res) {
  const query = Usuario.findById(req.params.id);

  query.exec(function(err, usuario) {
    if (err) {
      return res.status(500).json({
        message: 'Erro obtendo o Usuário.',
      });
    }

    if (!usuario) {
      return res.status(404).json({
        message: 'Usuário não encontrado.',
      });
    }

    return res.json(usuario.toJSON());
  });
};

module.exports.save = [
  validator.body('email', '')
  .trim()
  .notEmpty()
  .isEmail(),
  validator.body('abilities', '')
  .optional()
  .isArray(),
  function(req, res) {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    const data = {
      email: req.body.email,
      abilities: req.body.abilities,
    };

    if (req.params.id) {
      Usuario.findByIdAndUpdate(
        req.params.id,
        data,
        { returnDocument: 'after' },
        function(err, usuario) {
          if (!usuario) {
            return res.status(404).json({
              message: 'Usuário não encontrado.',
            });
          }

          if (err) {
            return res.status(500).json({
              message: 'Erro atualizando Usuário.',
            });
          }

          return res.json(usuario.toJSON());
        }
      );
    } else {
      let usuario = new Usuario(data);

      usuario.save(function(err, usuario) {
        if (err) {
          return res.status(500).json({
            message: 'Erro ao adicionar o Usuário.',
            error: err,
          });
        }

        return res.json(usuario.toJSON());
      });
    }
  }
];

module.exports.delete = function(req, res) {
  Usuario.findByIdAndRemove(req.params.id, function(err, usuario) {
    if (err) {
      return res.status(500).json({
        message: 'Erro ao remover a Usuário.',
      });
    }

    return res.json(usuario.toJSON());
  });
};
