import Unidade from '../../db/models/Unidade.js';
import validator from 'express-validator';
import { createMongoAbility } from '@casl/ability';
import { ApiError } from '../utils/ApiError.js';

export const listPublic = function (req, res, next) {
  const query = Unidade.find({});

  query.select('-token');

  query.sort('nome');

  query.then((unidades) => {
    return res.json(unidades.map(doc => doc.toJSON()));
  })
    .catch((error) => {
      return next(new ApiError('Erro obtendo Unidades públicas.', 500, error));
    });
};

export const list = function (req, res, next) {
  const ability = createMongoAbility(req.session.user.abilities);
  let fields = req.query.fields?.split(',');

  const query = Unidade.find({}).accessibleBy(ability);

  if (Array.isArray(fields)) {
    query.select(fields);
  }

  query.select('-token');

  query.sort('nome');

  query.then((unidades) => {
    return res.json(unidades.map(doc => doc.toJSON()));
  })
    .catch((error) => {
      return next(new ApiError('Erro obtendo Unidades.', 500, error));
    });
};

export const showPublic = function (req, res, next) {
  const query = Unidade.findById(req.params.id);

  query.select('-token');

  query.then((unidade) => {
    if (!unidade) {
      return next(new ApiError(`Unidade ${req.params.id} não encontrada.`, 404));
    }

    return res.json(unidade.toJSON());
  })
    .catch((error) => {
      return next(new ApiError(`Erro obtendo a Unidade pública ${req.params.id}.`, 500, error));
    });
};

export const show = function (req, res, next) {
  const ability = createMongoAbility(req.session.user.abilities);
  let fields = req.query.fields?.split(',');

  const query = Unidade.findById(req.params.id);

  if (Array.isArray(fields)) {
    query.select(fields);
  }

  if (ability.cannot('update', 'unidade')) {
    query.select('-token');
  }

  query.then((unidade) => {
    if (!unidade) {
      return next(new ApiError(`Unidade ${req.params.id} não encontrada.`, 404));
    }

    return res.json(unidade.toJSON());
  })
    .catch((error) => {
      return next(new ApiError(`Erro obtendo a Unidade ${req.params.id}.`, 500, error));
    });
};

export const token = function (req, res, next) {
  Unidade.findById(req.params.id).select('token')
    .then((unidade) => {
      if (!unidade) {
        return next(new ApiError(`Unidade ${req.params.id} não encontrada para obtenção do token.`, 404));
      }

      return res.json(unidade.token);
    }).catch((error) => {
      return next(new ApiError(`Erro obtendo o token da Unidade ${req.params.id}.`, 500, error));
    });
};

export const save = [
  validator.body('nome', '')
    .trim()
    .notEmpty(),
  validator.body('slug', '')
    .trim()
    .notEmpty()
    .isSlug(),
  validator.body('token', '')
    .trim()
    .notEmpty(),
  validator.body('imagem', '')
    .optional({ values: 'falsy' })
    .isDataURI(),
  validator.body('link_url', '')
    .trim()
    .optional({ values: 'falsy' })
    .isURL({ protocols: ['http', 'https'], require_protocol: true }),
  validator.body('link_titulo', '')
    .trim()
    .optional({ values: 'falsy' })
    .isString(),
  validator.body('contato', '')
    .optional({ values: 'falsy' })
    .isString(),
  function (req, res, next) {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError('Dados inválidos para salvar a Unidade.', 422, errors.mapped()));
    }

    const data = {
      nome: req.body.nome,
      slug: req.body.slug,
      token: req.body.token,
      imagem: req.body.imagem,
      link_url: req.body.link_url,
      link_titulo: req.body.link_titulo,
      contato: req.body.contato,
    };

    if (req.params.id) {
      Unidade.findByIdAndUpdate(req.params.id, data, { returnDocument: 'after' })
        .then((unidade) => {
          if (!unidade) {
            return next(new ApiError(`Unidade ${req.params.id} não encontrada para atualização.`, 404));
          }

          return res.json(unidade.toJSON());
        })
        .catch((error) => {
          return next(new ApiError(`Erro ao atualizar a Unidade ${req.params.id}.`, 500, error));
        });
    } else {
      let unidade = new Unidade(data);

      unidade.save()
        .then((unidade) => {
          return res.json(unidade.toJSON());
        })
        .catch((error) => {
          return next(new ApiError('Erro ao criar a Unidade.', 500, error));
        });
    }
  },
];

export const remove = function (req, res, next) {
  Unidade.findByIdAndDelete(req.params.id)
    .then((unidade) => {
      return res.json(unidade?.toJSON());
    })
    .catch((error) => {
      return next(new ApiError(`Erro ao excluir a Unidade ${req.params.id}.`, 500, error));
    });
};
