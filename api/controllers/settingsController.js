const Settings = require('../../db/models/Settings');
const validator = require('express-validator');

module.exports.showPublic = function(req, res) {
  const query = Settings.findById('settings');

  query.exec(function(err, settings) {
    if (err) {
      return res.status(500).json({
        message: 'Erro obtendo as Configurações.',
      });
    }

    if (!settings) {
      return res.status(404).json({
        message: 'Configurações não encontradas.',
      });
    }

    return res.json(settings.toJSON());
  });
};

module.exports.save = [
  validator.body('sigla', '')
    .trim()
    .notEmpty()
    .isString(),
  validator.body('nome', '')
    .trim()
    .notEmpty()
    .isString(),
  validator.body('intro', '')
    .trim()
    .optional({ checkFalsy: true })
    .isString(),
  function(req, res) {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    const data = {
      sigla: req.body.sigla,
      nome: req.body.nome,
      intro: req.body.intro,
    };

    Settings.findByIdAndUpdate(
      'settings',
      data,
      { returnDocument: 'after', upsert: true },
      function(err, settings) {
        if (!settings) {
          return res.status(404).json({
            message: 'Configurações não encontradas.',
          });
        }

        if (err) {
          return res.status(500).json({
            message: 'Erro salvando Configurações.',
          });
        }

        return res.json(settings.toJSON());
      }
    );
  }
];
