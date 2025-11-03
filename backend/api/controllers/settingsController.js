import Settings from '../../db/models/Settings.js';
import validator from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

export const show = function (req, res, next) {
  const query = Settings.findOne({});

  query.then((settings) => {
    if (!settings) {
      return next(new ApiError('Configurações não encontradas.', 404));
    }

    return res.json(settings.toJSON());
  })
    .catch((error) => {
      return next(new ApiError('Erro obtendo as Configurações.', 500, error));
    });
};

export const save = [
  validator.body('sigla', '')
    .trim()
    .notEmpty()
    .isString(),
  validator.body('orgao', '')
    .trim()
    .notEmpty()
    .isString(),
  validator.body('intro', '')
    .trim()
    .optional({ values: 'falsy' })
    .isString(),
  function (req, res, next) {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError('Dados inválidos para salvar as Configurações.', 422, errors.mapped()));
    }

    const data = {
      sigla: req.body.sigla,
      orgao: req.body.orgao,
      intro: req.body.intro,
    };

    if (data.intro === '<p></p>') data.intro = '';

    Settings.findOneAndUpdate({}, data, { returnDocument: 'after', upsert: true })
      .then((settings) => {
        return res.json(settings.toJSON());
      })
      .catch((error) => {
        return next(new ApiError('Erro salvando as Configurações.', 500, error));
      });
  },
];
