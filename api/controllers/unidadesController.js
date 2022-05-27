const Unidade = require('../models/Unidade');
const validator = require('express-validator');

module.exports.list = function(req, res) {
  Unidade.find({}, function(err, unidades) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Erro obtendo Unidades.',
      });
    }
    return res.json(unidades);
  });
};

module.exports.show = function(req, res) {
  let id = req.params.id;

  Unidade.findById(id, function(err, unidade) {
    if (err) {
      return res.status(500).json({
        message: 'Erro obtendo a Unidade.',
      });
    }

    if (!unidade) {
      return res.status(404).json({
        message: 'Unidade não encontrada.',
      });
    }

    return res.json(unidade);
  });
};

module.exports.save = [
  validator.body('nome', '')
    .trim()
    .notEmpty(),
  validator.body('slug', '')
    .trim()
    .notEmpty()
    .isAlpha(),
  validator.body('token', '')
    .trim()
    .notEmpty(),
  function(req, res) {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    if (req.params.id) {
      Unidade.findByIdAndUpdate(
        id,
        {
          nome: req.body.nome,
          slug: req.body.slug,
          token: req.body.token,
        },
        function(err, unidade) {
          if (err) {
            return res.status(500).json({
              message: 'Erro atualizando Unidade.',
            });
          }

          if (!unidade) {
            return res.status(404).json({
              message: 'Unidade não encontrada.',
            });
          }

          return res.json(unidade);
        }
      );
    } else {
      let unidade = new Unidade({
        nome: req.body.nome,
        slug: req.body.slug,
        token: req.body.token,
      });

      unidade.save(function(err, unidade) {
        if (err) {
          res.status(500).json({
            message: 'Erro ao adicionar a Unidade.',
            error: err,
          });
        }

        return res.json(unidade);
      });
    }
  }
];

module.exports.delete = function(req, res) {
  let id = req.params.id;

  Unidade.findByIdAndRemove(id, function(err, unidade) {
    if (err) {
      return res.status(500).json({
        message: 'Erro ao remover a Unidade.',
      });
    }

    return res.json(unidade);
  });
};
