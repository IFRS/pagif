const Settings = require('../../db/models/Settings');
const validator = require('express-validator');
const { logger } = require('../../logger');

module.exports.show = function(req, res) {
  const query = Settings.findOne({});

  query.then(settings => {
    if (!settings) {
      return res.status(404).json({
        message: 'Configurações não encontradas.',
      });
    }

    return res.json(settings.toJSON());
  })
  .catch(error => {
    logger.error('Erro obtendo as Configurações: %o', error);
    return res.status(500).json({
      message: 'Erro obtendo as Configurações.',
    });
  });
};

module.exports.save = [
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
  function(req, res) {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    const data = {
      sigla: req.body.sigla,
      orgao: req.body.orgao,
      intro: req.body.intro,
    };

    if (data.intro === '<p></p>') data.intro = '';

    Settings.findOneAndUpdate({}, data, { returnDocument: 'after', upsert: true })
    .then(settings => {
      return res.json(settings.toJSON());
    })
    .catch(error => {
      logger.error('Erro salvando Configurações: %o', error);
      return res.status(500).json({
        message: 'Erro salvando Configurações.',
      });
    });
  }
];
