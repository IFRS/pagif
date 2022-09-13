const Servico = require('../models/Servico');
const validator = require('express-validator');

module.exports.list = function(req, res) {
  const unidade_id = req.query.unidade;

  const populate = req.query.populate;
  const populate_fields = req.query.populate_fields?.replaceAll(',', ' ');

  const query = Servico.find({});

  if (unidade_id) {
    query.where({unidade: unidade_id});
  }

  if (populate && populate_fields) {
    query.populate(populate, populate_fields);
  }

  query.exec(function(err, servicos) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Erro obtendo Serviços.',
      });
    }

    return res.json(servicos);
  });
};

module.exports.show = function(req, res) {
  Servico.findById(req.params.id, function(err, servico) {
    if (err) {
      return res.status(500).json({
        message: 'Erro obtendo o Serviço.',
      });
    }

    if (!servico) {
      return res.status(404).json({
        message: 'Serviço não encontrado.',
      });
    }

    return res.json(servico);
  });
};

module.exports.save = [
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
    .optional({ checkFalsy: true })
    .isLength({ min: 1, max: 999 }),
  function(req, res) {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    const data = {
      unidade: req.body.unidade,
      codigo: req.body.codigo,
      nome: req.body.nome,
      desc: req.body.desc,
    };

    if (req.params.id) {
      Servico.findByIdAndUpdate(
        req.params.id,
        data,
        function(err, servico) {
          if (!servico) {
            return res.status(404).json({
              message: 'Serviço não encontrado.',
            });
          }

          if (err) {
            return res.status(500).json({
              message: 'Erro atualizando Serviço.',
            });
          }

          return res.json(servico);
        }
      );
    } else {
      let servico = new Servico(data);

      servico.save(function(err, servico) {
        if (err) {
          return res.status(500).json({
            message: 'Erro ao adicionar o Serviço.',
            error: err,
          });
        }

        return res.json(servico);
      });
    }
  }
];

module.exports.delete = function(req, res) {
  Servico.findByIdAndRemove(req.params.id, function(err, servico) {
    if (err) {
      return res.status(500).json({
        message: 'Erro ao remover o Serviço.',
      });
    }

    return res.json(servico);
  });
};
