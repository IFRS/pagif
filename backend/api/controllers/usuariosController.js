import { logger } from '../../logger/index.js';
import Usuario from '../../db/models/Usuario.js';
import validator from 'express-validator';

export const list = function (req, res) {
  const query = Usuario.find({});

  query.sort('nome');

  query.then((usuarios) => {
    return res.json(usuarios.map(doc => doc.toJSON()));
  })
    .catch((error) => {
      logger.error('Erro obtendo Usuários: %o', error);
      return res.status(500).json({
        message: 'Erro obtendo Usuários.',
      });
    });
};

export const show = function (req, res) {
  const query = Usuario.findById(req.params.id);

  query.then((usuario) => {
    if (!usuario) {
      return res.status(404).json({
        message: 'Usuário não encontrado.',
      });
    }

    return res.json(usuario.toJSON());
  })
    .catch((error) => {
      logger.error('Erro obtendo o Usuário: %o', error);
      return res.status(500).json({
        message: 'Erro obtendo o Usuário.',
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
  function (req, res) {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    const data = {
      email: req.body.email,
      abilities: req.body.abilities,
    };

    if (req.params.id) {
      Usuario.findByIdAndUpdate(req.params.id, data, { returnDocument: 'after' })
        .then((usuario) => {
          if (!usuario) {
            return res.status(404).json({
              message: 'Usuário não encontrado.',
            });
          }

          return res.json(usuario.toJSON());
        })
        .catch((error) => {
          logger.error('Erro atualizando Usuário: %o', error);
          return res.status(500).json({
            message: 'Erro atualizando Usuário.',
          });
        });
    } else {
      let usuario = new Usuario(data);

      usuario.save()
        .then((usuario) => {
          return res.json(usuario.toJSON());
        })
        .catch((error) => {
          logger.error('Erro ao adicionar o Usuário: %o', error);
          return res.status(500).json({
            message: 'Erro ao adicionar o Usuário.',
          });
        });
    }
  },
];

export const remove = function (req, res) {
  Usuario.findByIdAndRemove(req.params.id)
    .then((usuario) => {
      return res.json(usuario.toJSON());
    })
    .catch((error) => {
      logger.error('Erro ao remover a Usuário: %o', error);
      return res.status(500).json({
        message: 'Erro ao remover a Usuário.',
      });
    });
};
