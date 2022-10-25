const Unidade = require('../../db/models/Unidade');
const validator = require('express-validator');

module.exports.list = function(req, res) {
  let fields = req.query.fields?.split(',');

  const query = Unidade.find({});

  if (Array.isArray(fields)) {
    query.select(fields);
  }

  query.select('-token');

  query.sort('nome');

  query.exec(function(err, unidades) {
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
  let fields = req.query.fields?.split(',');

  const query = Unidade.findById(req.params.id);

  if (Array.isArray(fields)) {
    query.select(fields);
  }

  query.select('-token');

  query.exec(function(err, unidade) {
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

module.exports.token = function(req, res) {
  Unidade.findById(req.params.id).select('token').exec(function(err, unidade) {
    if (err) {
      return res.status(500).json({
        message: 'Erro obtendo o token da Unidade.',
      });
    }

    if (!unidade) {
      return res.status(404).json({
        message: 'Unidade não encontrada.',
      });
    }

    return res.json(unidade.token);
  });
};

module.exports.save = [
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
  function(req, res) {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    const data = {
      nome: req.body.nome,
      slug: req.body.slug,
      token: req.body.token,
    };

    if (req.params.id) {
      Unidade.findByIdAndUpdate(
        req.params.id,
        data,
        function(err, unidade) {
          if (!unidade) {
            return res.status(404).json({
              message: 'Unidade não encontrada.',
            });
          }

          if (err) {
            return res.status(500).json({
              message: 'Erro atualizando Unidade.',
            });
          }

          return res.json(unidade);
        }
      );
    } else {
      let unidade = new Unidade(data);

      unidade.save(function(err, unidade) {
        if (err) {
          return res.status(500).json({
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
  Unidade.findByIdAndRemove(req.params.id, function(err, unidade) {
    if (err) {
      return res.status(500).json({
        message: 'Erro ao remover a Unidade.',
      });
    }

    return res.json(unidade);
  });
};
