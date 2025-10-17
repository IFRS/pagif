import Servico from '../../db/models/Servico.js';
import validator from 'express-validator';
import { createMongoAbility } from '@casl/ability';

export const listPublic = function (req, res, next) {
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
      next({
        status: 500,
        context: 'Serviços Públicos',
        message: 'Erro obtendo Serviços.',
        details: error,
      });
    });
};

export const list = function (req, res, next) {
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
      next({
        status: 500,
        context: 'Serviços',
        message: 'Erro obtendo Serviços.',
        details: error,
      });
    });
};

export const show = function (req, res, next) {
  Servico.findById(req.params.id).then((servico) => {
    if (!servico) {
      next({
        status: 404,
        context: 'Serviço',
        message: 'Serviço não encontrado.',
      });
    }

    return res.json(servico.toJSON());
  })
    .catch((error) => {
      next({
        status: 500,
        context: 'Serviço',
        message: 'Erro obtendo o Serviço.',
        details: error,
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
  function (req, res, next) {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      next({
        status: 422,
        context: 'Salvar Serviço',
        message: 'Dados inválidos.',
        details: errors.mapped(),
      });
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
            next({
              status: 404,
              context: 'Salvar Serviço',
              message: 'Serviço não encontrado.',
            });
          }

          return res.json(servico.toJSON());
        })
        .catch((error) => {
          next({
            status: 500,
            context: 'Salvar Serviço',
            message: 'Erro atualizando o Serviço.',
            details: error,
          });
        });
    } else {
      let servico = new Servico(data);

      servico.save()
        .then((servico) => {
          return res.json(servico.toJSON());
        })
        .catch((error) => {
          next({
            status: 500,
            context: 'Salvar Serviço',
            message: 'Erro adicionando o Serviço.',
            details: error,
          });
        });
    }
  },
];

export const remove = function (req, res, next) {
  Servico.findByIdAndDelete(req.params.id).then((servico) => {
    return res.json(servico.toJSON());
  })
    .catch((error) => {
      next({
        status: 500,
        context: 'Remover Serviço',
        message: 'Erro ao remover o Serviço.',
        details: error,
      });
    });
};
