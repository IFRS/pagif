import Usuario from '../../db/models/Usuario.js';
import validator from 'express-validator';

export const list = function (req, res, next) {
  const query = Usuario.find({});

  query.sort('nome');

  query.then((usuarios) => {
    return res.json(usuarios.map(doc => doc.toJSON()));
  })
    .catch((error) => {
      next({
        status: 500,
        context: 'Listar Usuários',
        message: 'Erro obtendo Usuários.',
        details: error,
      });
    });
};

export const show = function (req, res, next) {
  const query = Usuario.findById(req.params.id);

  query.then((usuario) => {
    if (!usuario) {
      next({
        status: 404,
        context: 'Usuário',
        message: 'Usuário não encontrado.',
      });
    }

    return res.json(usuario.toJSON());
  });

  query.then((usuario) => {
    if (!usuario) {
      next({
        status: 404,
        context: 'Usuário',
        message: 'Usuário não encontrado.',
      });
    }

    return res.json(usuario.toJSON());
  })
    .catch((error) => {
      next({
        status: 500,
        context: 'Usuário',
        message: 'Erro obtendo o Usuário.',
        details: error,
      });
    });
};

export const save = [
  validator.body('email', '')
    .trim()
    .notEmpty()
    .isEmail(),
  validator.body('abilities', '')
    .optional()
    .isArray(),
  function (req, res, next) {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      next({
        status: 422,
        context: 'Salvar Usuário',
        message: 'Dados inválidos.',
        details: errors.mapped(),
      });
    }

    const data = {
      email: req.body.email,
      abilities: req.body.abilities,
    };

    if (req.params.id) {
      Usuario.findByIdAndUpdate(req.params.id, data, { returnDocument: 'after' })
        .then((usuario) => {
          if (!usuario) {
            next({
              status: 404,
              context: 'Atualizar Usuário',
              message: 'Usuário não encontrado.',
            });
          }

          return res.json(usuario.toJSON());
        })
        .catch((error) => {
          next({
            status: 500,
            context: 'Atualizar Usuário',
            message: 'Erro atualizando Usuário.',
            details: error,
          });
        });
    } else {
      let usuario = new Usuario(data);

      usuario.save()
        .then((usuario) => {
          return res.json(usuario.toJSON());
        })
        .catch((error) => {
          next({
            status: 500,
            context: 'Adicionar Usuário',
            message: 'Erro ao adicionar o Usuário.',
            details: error,
          });
        });
    }
  },
];

export const remove = function (req, res, next) {
  Usuario.findByIdAndDelete(req.params.id)
    .then((usuario) => {
      return res.json(usuario.toJSON());
    })
    .catch((error) => {
      next({
        status: 500,
        context: 'Remover Usuário',
        message: 'Erro ao remover a Usuário.',
        details: error,
      });
    });
};
