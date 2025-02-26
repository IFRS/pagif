import Unidade from '../../db/models/Unidade.js';
import validator from 'express-validator';
import { createMongoAbility } from '@casl/ability';
import { logger } from '../../logger/index.js';

export const listPublic = function (req, res) {
  const query = Unidade.find({});

  query.select('-token');

  query.sort('nome');

  query.then((unidades) => {
    return res.json(unidades.map(doc => doc.toJSON()));
  })
    .catch((error) => {
      logger.error('Erro obtendo Unidades: %o', error);
      return res.status(500).json({
        message: 'Erro obtendo Unidades.',
      });
    });
};

export const list = function (req, res) {
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
      logger.error('Erro obtendo Unidades: %o', error);
      return res.status(500).json({
        message: 'Erro obtendo Unidades.',
      });
    });
};

export const showPublic = function (req, res) {
  const query = Unidade.findById(req.params.id);

  query.select('-token');

  query.then((unidade) => {
    if (!unidade) {
      return res.status(404).json({
        message: 'Unidade não encontrada.',
      });
    }

    return res.json(unidade.toJSON());
  })
    .catch((error) => {
      logger.error('Erro obtendo a Unidade: %o', error);
      return res.status(500).json({
        message: 'Erro obtendo a Unidade.',
      });
    });
};

export const show = function (req, res) {
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
      return res.status(404).json({
        message: 'Unidade não encontrada.',
      });
    }

    return res.json(unidade.toJSON());
  })
    .catch((error) => {
      logger.error('Erro obtendo a Unidade: %o', error);
      return res.status(500).json({
        message: 'Erro obtendo a Unidade.',
      });
    });
};

export const token = function (req, res) {
  Unidade.findById(req.params.id).select('token')
    .then((unidade) => {
      if (!unidade) {
        return res.status(404).json({
          message: 'Unidade não encontrada.',
        });
      }

      return res.json(unidade.token);
    }).catch((error) => {
      logger.error('Erro obtendo o token da Unidade: %o', error);
      return res.status(500).json({
        message: 'Erro obtendo o token da Unidade.',
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
  function (req, res) {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
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
            return res.status(404).json({
              message: 'Unidade não encontrada.',
            });
          }

          return res.json(unidade.toJSON());
        })
        .catch((error) => {
          logger.error('Erro atualizando Unidade: %o', error);
          return res.status(500).json({
            message: 'Erro atualizando Unidade.',
          });
        });
    } else {
      let unidade = new Unidade(data);

      unidade.save()
        .then((unidade) => {
          return res.json(unidade.toJSON());
        })
        .catch((error) => {
          logger.error('Erro ao adicionar a Unidade: %o', error);
          return res.status(500).json({
            message: 'Erro ao adicionar a Unidade.',
          });
        });
    }
  },
];

export const remove = function (req, res) {
  Unidade.findByIdAndRemove(req.params.id)
    .then((unidade) => {
      return res.json(unidade.toJSON());
    })
    .catch((error) => {
      logger.error('Erro ao remover a Unidade: %o', error);
      return res.status(500).json({
        message: 'Erro ao remover a Unidade.',
      });
    });
};
