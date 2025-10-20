import Usuario from '../../db/models/Usuario.js';
import validator from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

export const list = function (req, res, next) {
  const query = Usuario.find({});

  query.sort('nome');

  query.then((usuarios) => {
    return res.json(usuarios.map(doc => doc.toJSON()));
  })
    .catch((error) => {
      return next(new ApiError('Erro obtendo a lista de Usuários.', 500, error));
    });
};

export const show = function (req, res, next) {
  const query = Usuario.findById(req.params.id);

  query.then((usuario) => {
    if (!usuario) {
      return next(new ApiError(`Usuário ${req.params.id} não encontrado.`, 404));
    }

    return res.json(usuario.toJSON());
  })
    .catch((error) => {
      return next(new ApiError(`Erro obtendo o Usuário ${req.params.id}.`, 500, error));
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
      return next(new ApiError('Dados inválidos para salvar o Usuário.', 422, errors.mapped()));
    }

    const data = {
      email: req.body.email,
      abilities: req.body.abilities,
    };

    if (req.params.id) {
      Usuario.findByIdAndUpdate(req.params.id, data, { returnDocument: 'after' })
        .then((usuario) => {
          if (!usuario) {
            return next(new ApiError(`Usuário ${req.params.id} não encontrado para atualização.`, 404));
          }

          return res.json(usuario.toJSON());
        })
        .catch((error) => {
          return next(new ApiError(`Erro ao atualizar o Usuário ${req.params.id}.`, 500, error));
        });
    } else {
      let usuario = new Usuario(data);

      usuario.save()
        .then((usuario) => {
          return res.json(usuario.toJSON());
        })
        .catch((error) => {
          return next(new ApiError('Erro ao criar o Usuário.', 500, error));
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
      return next(new ApiError(`Erro ao excluir o Usuário ${req.params.id}.`, 500, error));
    });
};
