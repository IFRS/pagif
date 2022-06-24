const Pagamento = require('../models/Pagamento');
const validator = require('express-validator');
const pagtesouro = require('../pagtesouro');

module.exports.list = function(req, res) {
  const query = Pagamento.find({});
  query.exec(function(err, pagamentos) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Erro obtendo Pagamentos.',
      });
    }

    return res.json(pagamentos);
  });
};

module.exports.show = function(req, res) {
  Pagamento.findById(req.params.id, function(err, pagamento) {
    if (err) {
      return res.status(500).json({
        message: 'Erro obtendo o Pagamento.',
      });
    }

    if (!pagamento) {
      return res.status(404).json({
        message: 'Pagamento não encontrado.',
      });
    }

    return res.json(pagamento);
  });
};

module.exports.save = [
  validator.body('codigoServico', '')
    .trim()
    .notEmpty()
    .isNumeric({ no_symbols: true })
    .isLength({ max: 5 }),
  validator.body('referencia', '')
    .optional({ checkFalsy: true })
    .trim()
    .isNumeric({ no_symbols: true })
    .isLength({ min: 1, max: 20 }),
  validator.body('competencia', '')
    .optional({ checkFalsy: true })
    .trim()
    .isISO8601(),
  validator.body('vencimento', '')
    .optional({ checkFalsy: true })
    .trim()
    .isISO8601(),
  validator.body('nomeContribuinte', '')
    .notEmpty()
    .trim()
    .isAlpha('pt-BR', { ignore: ' _-' })
    .isLength({ min: 2, max: 45 }),
  validator.body('cnpjCpf', '')
    .optional({ checkFalsy: true })
    .trim()
    .isNumeric({ no_symbols: true })
    .isLength({ min: 11, max: 14 }),
  validator.body('valorPrincipal', '')
    .trim()
    .notEmpty()
    .isInt({ allow_leading_zeroes: false })
    .isLength({ min: 1, max: 17 }),
  validator.body(['valorDescontos', 'valorOutrasDeducoes', 'valorMulta', 'valorJuros', 'valorOutrosAcrescimos'], '')
    .optional({ checkFalsy: true })
    .trim()
    .isInt({ allow_leading_zeroes: false })
    .isLength({ min: 1, max: 17 }),
  function(req, res) {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    const data = {
      codigoServico: req.body.codigoServico,
      referencia: req.body.referencia,
      competencia: req.body.competencia,
      vencimento: req.body.vencimento,
      nomeContribuinte: req.body.nomeContribuinte,
      cnpjCpf: req.body.cnpjCpf,
      valorPrincipal: req.body.valorPrincipal,
      valorDescontos: req.body.valorDescontos,
      valorOutrasDeducoes: req.body.valorOutrasDeducoes,
      valorMulta: req.body.valorMulta,
      valorJuros: req.body.valorJuros,
      valorOutrosAcrescimos: req.body.valorOutrosAcrescimos,
    };

    pagtesouro.post('/api/gru/solicitacao-pagamento', data, { headers: {'Authorization': `Bearer ${process.env.PAGTESOURO_TOKEN}`} })
    .then((response) => {
      Object.assign(data, response.data);

      let pagamento = new Pagamento(data);

      pagamento.save(function(err, pagamento) {
        if (err) {
          return res.status(500).json({
            message: 'Erro ao adicionar o Pagamento.',
            error: err,
          });
        }

        return res.json(pagamento);
      });
    })
    .catch((error) => {
      return res.status(500).json(error);
    });
  }
];

module.exports.update = [
  validator.body('tipoPagamentoEscolhido', '')
    .optional({ checkFalsy: true })
    .trim()
    .isAlpha()
    .isLength({ max: 20 }),
  validator.body('valor', '')
    .trim()
    .notEmpty()
    .isInt({ allow_leading_zeroes: false })
    .isLength({ min: 1, max: 17 }),
  validator.body('nomePSP', '')
    .trim()
    .notEmpty()
    .isAlpha()
    .isLength({ max: 50 }),
  validator.body('transacaoPSP', '')
    .trim()
    .notEmpty()
    .isAlpha()
    .isLength({ max: 50 }),
  validator.body('situacao', '')
    .trim()
    .notEmpty()
    .isJSON(),
  function(req, res) {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    if (req.params.id) {
      const data = {
        tipoPagamentoEscolhido: req.body.tipoPagamentoEscolhido,
        valor: req.body.valor,
        nomePSP: req.body.nomePSP,
        transacaoPSP: req.body.transacaoPSP,
        situacao: req.body.situacao,
      };

      Pagamento.findByIdAndUpdate(
        req.params.id,
        data,
        function(err, pagamento) {
          if (!pagamento) {
            return res.status(404).json({
              message: 'Pagamento não encontrado.',
            });
          }

          if (err) {
            return res.status(500).json({
              message: 'Erro atualizando Pagamento.',
            });
          }

          return res.json(pagamento);
        }
      );
    } else {
      return res.status(400).json({
        message: 'ID não presente.',
        error: err,
      });
    }
  }
];

module.exports.delete = function(req, res) {
  Pagamento.findByIdAndRemove(req.params.id, function(err, pagamento) {
    if (err) {
      return res.status(500).json({
        message: 'Erro ao remover o Pagamento.',
      });
    }

    return res.json(pagamento);
  });
};
