import Unidade from '../../db/models/Unidade.js';
import validator from 'express-validator';
import { createMongoAbility } from '@casl/ability';

export const listPublic = function (req, res, next) {
  const query = Unidade.find({});

  query.select('-token');

  query.sort('nome');

  query.then((unidades) => {
    return res.json(unidades.map(doc => doc.toJSON()));
  })
    .catch((error) => {
      next({
        status: 500,
        context: 'Unidades Públicas',
        message: 'Erro obtendo Unidades.',
        details: error,
      });
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
      next({
        status: 500,
        context: 'Unidades',
        message: 'Erro obtendo Unidades.',
        details: error,
      });
    });
};

export const showPublic = function (req, res, next) {
  const query = Unidade.findById(req.params.id);

  query.select('-token');

  query.then((unidade) => {
    if (!unidade) {
      next({
        status: 404,
        context: 'Unidade Pública',
        message: 'Unidade não encontrada.',
      });
    }

    return res.json(unidade.toJSON());
  })
    .catch((error) => {
      next({
        status: 500,
        context: 'Unidade Pública',
        message: 'Erro obtendo a Unidade.',
        details: error,
      });
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
      next({
        status: 404,
        context: 'Unidade',
        message: 'Unidade não encontrada.',
      });
    }

    return res.json(unidade.toJSON());
  })
    .catch((error) => {
      next({
        status: 500,
        context: 'Unidade',
        message: 'Erro obtendo a Unidade.',
        details: error,
      });
    });
};

export const token = function (req, res, next) {
  Unidade.findById(req.params.id).select('token')
    .then((unidade) => {
      if (!unidade) {
        next({
          status: 404,
          context: 'Token da Unidade',
          message: 'Unidade não encontrada.',
        });
      }

      return res.json(unidade.token);
    }).catch((error) => {
      next({
        status: 500,
        context: 'Token da Unidade',
        message: 'Erro obtendo o token.',
        details: error,
      });
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
      next({
        status: 422,
        context: 'Salvar Unidade',
        message: 'Dados inválidos.',
        details: errors.mapped(),
      });
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
            next({
              status: 404,
              context: 'Atualizar Unidade',
              message: 'Unidade não encontrada.',
            });
          }

          return res.json(unidade.toJSON());
        })
        .catch((error) => {
          next({
            status: 500,
            context: 'Atualizar Unidade',
            message: 'Erro atualizando a Unidade.',
            details: error,
          });
        });
    } else {
      let unidade = new Unidade(data);

      unidade.save()
        .then((unidade) => {
          return res.json(unidade.toJSON());
        })
        .catch((error) => {
          next({
            status: 500,
            context: 'Salvar Unidade',
            message: 'Erro ao adicionar a Unidade.',
            details: error,
          });
        });
    }
  },
];

export const remove = function (req, res, next) {
  Unidade.findByIdAndDelete(req.params.id)
    .then((unidade) => {
      return res.json(unidade.toJSON());
    })
    .catch((error) => {
      next({
        status: 500,
        context: 'Remover Unidade',
        message: 'Erro ao remover a Unidade.',
        details: error,
      });
    });
};
