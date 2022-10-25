const Pagamento = require('../../db/models/Pagamento');
const Servico = require('../../db/models/Servico');
const validator = require('express-validator');
const pagtesouro = require('../pagtesouro');

module.exports.list = function(req, res) {
  const query = Pagamento.find({}).select('-token').sort('-dataCriacao')

  if (req.query) {
    if (req.query.unidades) {
      query.where('nomeUnidade').in(req.query.unidades);
    }
    if (req.query.situacoes) {
      query.where('situacao.codigo').in(req.query.situacoes);
    }
  }

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
  Pagamento.findById(req.params.id).select('-token').exec(function(err, pagamento) {
    if (err) {
      return res.status(500).json({
        message: 'Erro obtendo o Pagamento.',
        error: err,
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

    Servico.findOne({ codigo: req.body.codigoServico }).populate('unidade').exec((err, servico) => {
      if (err) {
        return res.status(500).json({
          message: 'Erro ao buscar Serviço.',
          error: err,
        });
      }

      if (!servico) {
        return res.status(500).json({
          message: `Serviço de código ${req.body.codigoServico} não encontrado.`,
          error: err,
        });
      }

      data.nomeServico = servico.nome;
      data.nomeUnidade = servico.unidade.nome;
      data.token = servico.unidade.token;

      pagtesouro.post('/api/gru/solicitacao-pagamento', data, { headers: {'Authorization': `Bearer ${data.token}`} })
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
    });
  }
];

module.exports.update = [
  validator.body('idPagamento', 'Identificador do Pagamento está num formato inválido.')
    .trim()
    .notEmpty()
    .isAlphanumeric()
    .isLength({ max: 50 }),
  function(req, res) {
    if (req.body.idPagamento) {
      Pagamento.findById(req.body.idPagamento).exec((err, pagamento) => {
        if (err || !pagamento) {
          return res.status(500).json([{
            codigo: 'C0027',
            descricao: 'Falha ao verificar a situação do pagamento.',
          }]);
        }

        pagtesouro.get(`/api/gru/pagamentos/${pagamento.idPagamento}`, { headers: {'Authorization': `Bearer ${pagamento.token}`} })
        .then((response) => {
          Object.assign(pagamento, response.data);
          pagamento.save()
          .then((pagamentoAfterSave) => {
            delete pagamentoAfterSave.token;
            return res.json(pagamentoAfterSave);
          })
          .catch((error) => {
            console.error('Erro atualizando o Pagamento: ' + error);
            return res.status(500).json([{
              codigo: 'C0027',
              descricao: 'Falha ao verificar a situação do pagamento.',
            }]);
          });
        })
        .catch((error) => {
          console.error('Erro consultando o Pagamento!', error, error.response?.data);
          return res.status(500).json([{
            codigo: 'C0027',
            descricao: 'Falha ao verificar a situação do pagamento.',
          }]);
        });
      });
    } else {
      return res.status(400).json({
        message: 'idPagamento não presente.',
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
