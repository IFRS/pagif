import Servico from '../../db/models/Servico.js';
import validator from 'express-validator';
import { createMongoAbility } from '@casl/ability';
import { logger } from '../../logger/index.js';

export const listPublic = function (req, res) {
  const unidade_id = req.query.unidade;

  const query = Servico.find({});

  if (unidade_id) {
    query.where({ unidade: unidade_id });
  }

  query.select('-createdAt -updatedAt');

  query.then((servicos) => {
    return res.json(servicos.map(doc => doc.toJSON()));
  })
    .catch((error) => {
      logger.error('Erro obtendo Serviços: %o', error);
      return res.status(500).json({
        message: 'Erro obtendo Serviços.',
      });
    });
};

export const list = function (req, res) {
  const ability = createMongoAbility(req.session.user.abilities);
  const unidade_id = req.query.unidade;

  const populate = req.query.populate;
  const populate_fields = req.query.populate_fields?.replaceAll(',', ' ');

  const query = Servico.find({}).accessibleBy(ability);

  if (unidade_id) {
    query.where({ unidade: unidade_id });
  }

  if (populate && populate_fields) {
    query.populate(populate, populate_fields);
  }

  query.then((servicos) => {
    return res.json(servicos.map(doc => doc.toJSON()));
  })
    .catch((error) => {
      logger.error('Erro obtendo Serviços: %o', error);
      return res.status(500).json({
        message: 'Erro obtendo Serviços.',
      });
    });
};

export const show = function (req, res) {
  Servico.findById(req.params.id).then((servico) => {
    if (!servico) {
      return res.status(404).json({
        message: 'Serviço não encontrado.',
      });
    }

    return res.json(servico.toJSON());
  })
    .catch((error) => {
      logger.error('Erro obtendo o Serviço: %o', error);
      return res.status(500).json({
        message: 'Erro obtendo o Serviço.',
      });
    });
};

export const save = [
  validator.body('unidade', '')
    .trim()
    .notEmpty(),
  validator.body('codigo', '')
    .trim()
    .notEmpty()
    .isNumeric({ no_symbols: true })
    .isLength({ min: 1, max: 5 }),
  validator.body('nome', '')
    .trim()
    .notEmpty(),
  validator.body('desc', '')
    .trim()
    .optional({ values: 'falsy' })
    .isLength({ min: 1, max: 999 }),
  validator.body('referencia_required', '')
    .optional({ values: 'null' })
    .isBoolean(),
  function (req, res) {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    const data = {
      unidade: req.body.unidade,
      codigo: req.body.codigo,
      nome: req.body.nome,
      desc: req.body.desc,
      referencia_required: req.body.referencia_required,
    };

    if (req.params.id) {
      Servico.findByIdAndUpdate(req.params.id, data, { returnDocument: 'after' })
        .then((servico) => {
          if (!servico) {
            return res.status(404).json({
              message: 'Serviço não encontrado.',
            });
          }

          return res.json(servico.toJSON());
        })
        .catch((error) => {
          logger.error('Erro atualizando Serviço: %o', error);
          return res.status(500).json({
            message: 'Erro atualizando Serviço.',
          });
        });
    } else {
      let servico = new Servico(data);

      servico.save()
        .then((servico) => {
          return res.json(servico.toJSON());
        })
        .catch((error) => {
          logger.error('Erro ao adicionar o Serviço: %o', error);
          return res.status(500).json({
            message: 'Erro ao adicionar o Serviço.',
          });
        });
    }
  },
];

export const remove = function (req, res) {
  Servico.findByIdAndDelete(req.params.id).then((servico) => {
    return res.json(servico.toJSON());
  })
    .catch((error) => {
      logger.error('Erro ao remover o Serviço: %o', error);
      return res.status(500).json({
        message: 'Erro ao remover o Serviço.',
      });
    });
};
