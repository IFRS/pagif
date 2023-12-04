const Pagamento = require('../../db/models/Pagamento');
const Servico = require('../../db/models/Servico');
const validator = require('express-validator');
const pagtesouro = require('../pagtesouro');
const dayjs = require('dayjs')
const { createMongoAbility } = require('@casl/ability');
const { logger } = require('../../logger');

module.exports.showPublic = function(req, res) {
  Pagamento.findById(req.params.id).select('-token -tipoPagamentoEscolhido -nomePSP -transacaoPSP')
  .then(pagamento => {
    if (!pagamento) {
      return res.status(404).json({
        message: 'Pagamento não encontrado.',
      });
    }

    pagamento = pagamento.toObject();

    if (pagamento.cnpjCpf) {
      if (pagamento.cnpjCpf.length === 11) {
        pagamento.cnpjCpf = pagamento.cnpjCpf.replace(/(.{3})(.{3})(.{3})(.{2})/, "***$2$3**");
      } else if (pagamento.cnpjCpf.length === 14) {
        pagamento.cnpjCpf = pagamento.cnpjCpf.replace(/(.{2})(.{3})(.{3})(.{4})(.{2})/, "*****$3$4**");
      }
    }

    return res.json(pagamento);
  })
  .catch(error => {
    logger.error('Erro obtendo o Pagamento: %o', error);
    return res.status(500).json({
      message: 'Erro obtendo o Pagamento.',
    });
  });
};

module.exports.list = function(req, res) {
  const ability = createMongoAbility(req.session.user.abilities);
  const query = Pagamento.find({}).accessibleBy(ability).select('-token').sort('-dataCriacao');

  if (req.query) {
    if (req.query.unidades) {
      query.where('nomeUnidade').in(req.query.unidades);
    }

    if (req.query.situacoes) {
      query.where('situacao.codigo').in(req.query.situacoes);
    }

    if (
      req.query.datas
      && Array.isArray(req.query.datas)
      && req.query.datas.length >= 1
      && dayjs(req.query.datas[0]).isValid()
    ) {
      const datas = req.query.datas;
      query.where('situacao.data').gte(dayjs(datas[0]).startOf('day').toDate());
      if (datas[1] && dayjs(datas[1]).isValid()) query.lte(dayjs(datas[1]).endOf('day').toDate());
    } else {
      query.or([{ 'situacao.data': null }, { 'situacao.data': { $gte: dayjs().startOf('day').subtract(30, 'day').toDate() } }]);
    }
  }

  query.then(pagamentos => {
    return res.json(pagamentos.map(doc => doc.toJSON()));
  })
  .catch(error => {
    logger.error('Erro obtendo Pagamentos: %o', error);
    return res.status(500).json({
      message: 'Erro obtendo Pagamentos.',
    });
  });
};

module.exports.show = function(req, res) {
  Pagamento.findById(req.params.id).select('-token')
  .then(pagamento => {
    if (!pagamento) {
      return res.status(404).json({
        message: 'Pagamento não encontrado.',
      });
    }

    return res.json(pagamento.toJSON());
  })
  .catch(error => {
    logger.error('Erro obtendo o Pagamento: %o', error);
    return res.status(500).json({
      message: 'Erro obtendo o Pagamento.',
    });
  });
};

module.exports.save = [
  validator.body('codigoServico', '')
    .trim()
    .notEmpty()
    .isNumeric({ no_symbols: true })
    .isLength({ max: 5 }),
  validator.body('referencia', '')
    .optional({ values: 'falsy' })
    .trim()
    .isNumeric({ no_symbols: true })
    .isLength({ min: 1, max: 20 }),
  validator.body('competencia', '')
    .optional({ values: 'falsy' })
    .trim()
    .isISO8601(),
  validator.body('vencimento', '')
    .optional({ values: 'falsy' })
    .trim()
    .isISO8601(),
  validator.body('nomeContribuinte', '')
    .notEmpty()
    .trim()
    .isAlpha('pt-BR', { ignore: ' _-' })
    .isLength({ min: 2, max: 45 }),
  validator.body('cnpjCpf', '')
    .notEmpty()
    .trim()
    .isNumeric({ no_symbols: true })
    .isLength({ min: 11, max: 14 }),
  validator.body('valorPrincipal', '')
    .trim()
    .notEmpty()
    .isInt({ allow_leading_zeroes: false })
    .isLength({ min: 1, max: 17 }),
  validator.body(['valorDescontos', 'valorOutrasDeducoes', 'valorMulta', 'valorJuros', 'valorOutrosAcrescimos'], '')
    .optional({ values: 'falsy' })
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

    Servico.findOne({ codigo: data.codigoServico }).populate('unidade')
    .then(servico => {
      if (!servico) {
        return res.status(500).json({
          message: `Serviço de código ${data.codigoServico} não encontrado.`,
        });
      }

      data.token = servico.unidade.token;
      data.unidade = servico.unidade._id;
      data.nomeUnidade = servico.unidade.nome;
      data.nomeServico = servico.nome;

      pagtesouro.post('/api/gru/solicitacao-pagamento', data, { headers: {'Authorization': `Bearer ${data.token}`} })
      .then((response) => {
        Object.assign(data, response.data);

        let pagamento = new Pagamento(data);

        pagamento.save()
        .then(pagamento => {
          return res.json(pagamento.toJSON());
        })
        .catch(error => {
          logger.error('Erro ao adicionar o Pagamento: %o', error);
          return res.status(500).json({
            message: 'Erro ao adicionar o Pagamento.',
          });
        });
      })
      .catch((error) => {
        logger.error('Erro ao solicitar criação do Pagamento: %o', error);
        return res.status(500).json({
          message: 'Erro ao solicitar criação do Pagamento.',
        });
      });
    })
    .catch(error => {
      logger.error('Erro ao buscar Serviço: %o', error);
      return res.status(500).json({
        message: 'Erro ao buscar Serviço.',
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
      Pagamento.findById(req.body.idPagamento)
      .then(pagamento => {
        if (!pagamento) {
          return res.status(500).json([{
            codigo: 'C0027',
            descricao: 'Falha ao verificar a situação do pagamento.',
          }]);
        }

        pagtesouro.get(`/api/gru/pagamentos/${pagamento.idPagamento}`, { headers: {'Authorization': `Bearer ${pagamento.token}`} })
        .then((response) => {
          let pagamentoBeforeSave = pagamento.toJSON();
          Object.assign(pagamento, response.data);
          pagamento.save()
          .then((pagamentoAfterSave) => {
            if (JSON.stringify(pagamentoAfterSave.toJSON()) === JSON.stringify(pagamentoBeforeSave)) return res.status(204).end();
            return res.json(pagamentoAfterSave.toJSON({
              transform: function(doc, ret) {
                delete ret.token;
                return ret;
              }
            }));
          })
          .catch((error) => {
            logger.error('Erro atualizando o Pagamento: %o' + error);
            return res.status(500).json([{
              codigo: 'C0027',
              descricao: 'Falha ao verificar a situação do pagamento.',
            }]);
          });
        })
        .catch((error) => {
          logger.error('Erro consultando o Pagamento: %o / %o', error, error.response?.data);
          return res.status(500).json([{
            codigo: 'C0027',
            descricao: 'Falha ao verificar a situação do pagamento.',
          }]);
        });
      })
      .catch(() => {
        return res.status(500).json([{
          codigo: 'C0027',
          descricao: 'Falha ao verificar a situação do pagamento.',
        }]);
      });
    } else {
      return res.status(400).json({
        message: 'idPagamento não presente.',
        error: null,
      });
    }
  }
];

module.exports.delete = function(req, res) {
  Pagamento.findByIdAndRemove(req.params.id)
  .then(pagamento => {
    return res.json(pagamento.toJSON());
  })
  .catch(error => {
    logger.error('Erro ao remover o Pagamento: %o', error);
    return res.status(500).json({
      message: 'Erro ao remover o Pagamento.',
    });
  });
};
