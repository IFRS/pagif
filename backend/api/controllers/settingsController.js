import Settings from '../../db/models/Settings.js';
import validator from 'express-validator';

export const show = function (req, res, next) {
  const query = Settings.findOne({});

  query.then((settings) => {
    if (!settings) {
      next({
        status: 404,
        context: 'Configurações',
        message: 'Configurações não encontradas.',
      });
    }

    return res.json(settings.toJSON());
  })
    .catch((error) => {
      next({
        status: 500,
        context: 'Configurações',
        message: 'Erro obtendo as Configurações.',
        details: error,
      });
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
      next({
        status: 422,
        context: 'Salvar Configurações',
        message: 'Dados inválidos.',
        details: errors.mapped(),
      });
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
        next({
          status: 500,
          context: 'Salvar Configurações',
          message: 'Erro salvando as Configurações.',
          details: error,
        });
      });
  },
];
