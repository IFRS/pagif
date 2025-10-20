import Servico from '../../db/models/Servico.js';
import validator from 'express-validator';
import { createMongoAbility } from '@casl/ability';
import { ApiError } from '../utils/ApiError.js';

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
      return next(new ApiError('Erro obtendo Serviços públicos.', 500, error));
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
      return next(new ApiError('Erro obtendo Serviços.', 500, error));
    });
};

export const show = function (req, res, next) {
  Servico.findById(req.params.id).then((servico) => {
    if (!servico) {
      return next(new ApiError(`Serviço ${req.params.id} não encontrado.`, 404));
    }

    return res.json(servico.toJSON());
  })
    .catch((error) => {
      return next(new ApiError(`Erro obtendo o Serviço ${req.params.id}.`, 500, error));
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
      return next(new ApiError('Dados inválidos para cadastro de Serviço.', 422, errors.mapped()));
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
            return next(new ApiError(`Serviço ${req.params.id} não encontrado para atualização.`, 404));
          }

          return res.json(servico.toJSON());
        })
        .catch((error) => {
          return next(new ApiError(`Erro atualizando o Serviço ${req.params.id}.`, 500, error));
        });
    } else {
      let servico = new Servico(data);

      servico.save()
        .then((servico) => {
          return res.json(servico.toJSON());
        })
        .catch((error) => {
          return next(new ApiError('Erro criando o Serviço.', 500, error));
        });
    }
  },
];

export const remove = function (req, res, next) {
  Servico.findByIdAndDelete(req.params.id).then((servico) => {
    return res.json(servico.toJSON());
  })
    .catch((error) => {
      return next(new ApiError(`Erro ao remover o Serviço ${req.params.id}.`, 500, error));
    });
};
