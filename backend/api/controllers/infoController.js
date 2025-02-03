const { logger } = require('../../logger');
const { createMongoAbility } = require('@casl/ability');

const Unidade = require('../../db/models/Unidade');
const Servico = require('../../db/models/Servico');
const Pagamento = require('../../db/models/Pagamento');

module.exports.count = async (req, res) => {
  const unidades = Unidade.countDocuments().exec();
  const servicos = Servico.countDocuments().exec();
  const pagamentos = Pagamento.countDocuments().exec();

  await Promise.allSettled([unidades, servicos, pagamentos])
    .then((responses) => {
      let result = {};
      if (responses[0].status === 'fulfilled') result.unidades = responses[0].value;
      if (responses[1].status === 'fulfilled') result.servicos = responses[1].value;
      if (responses[2].status === 'fulfilled') result.pagamentos = responses[2].value;
      res.json(result);
    });
};

module.exports.pagamentos_por_tipo = (req, res) => {
  const ability = createMongoAbility(req.session.user.abilities);

  const query = Pagamento.accessibleBy(ability).getQuery();

  const aggregate = Pagamento.aggregate([
    {
      $match: {
        $and: [
          query,
        ],
      },
    },
    {
      $group: {
        _id: '$tipoPagamentoEscolhido',
        count: { $sum: 1 },
      },
    },
  ]);

  aggregate.then(resultado => res.json(resultado))
    .catch((error) => {
      logger.error('Erro obtendo informações sobre formas de pagamento: %o', error);
      return res.status(500).json({
        message: 'Erro obtendo Informações.',
      });
    });
};

module.exports.pagamentos_por_servicos = (req, res) => {
  const ability = createMongoAbility(req.session.user.abilities);
  const unidade_id = req.query.unidade;

  const query = Pagamento.accessibleBy(ability);

  if (unidade_id) {
    query.where({ unidade: unidade_id });
  }

  const aggregate = Pagamento.aggregate([
    {
      $match: {
        $and: [
          query.getQuery(),
        ],
      },
    },
    {
      $group: {
        _id: '$nomeServico',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  aggregate.then(resultado => res.json(resultado))
    .catch((error) => {
      logger.error('Erro obtendo informações sobre serviços: %o', error);
      return res.status(500).json({
        message: 'Erro obtendo Informações.',
      });
    });
};
