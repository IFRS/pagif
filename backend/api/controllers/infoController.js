import { createMongoAbility } from '@casl/ability';

import Unidade from '../../db/models/Unidade.js';
import Servico from '../../db/models/Servico.js';
import Pagamento from '../../db/models/Pagamento.js';
import { ApiError } from '../utils/ApiError.js';

export const count = async (req, res, next) => {
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
    })
    .catch((error) => {
      return next(new ApiError('Erro ao contar documentos.', 500, error));
    });
};

export const pagamentos_por_tipo = (req, res, next) => {
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
      return next(new ApiError('Erro obtendo estatísticas sobre pagamentos por tipo.', 500, error));
    });
};

export const pagamentos_por_servicos = (req, res, next) => {
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
      return next(new ApiError('Erro obtendo estatísticas sobre pagamentos por serviços.', 500, error));
    });
};

export const pagamentos_por_mes_ano = (req, res, next) => {
  const ability = createMongoAbility(req.session.user.abilities);
  const unidade_id = req.query.unidade;

  const query = Pagamento.accessibleBy(ability);

  if (unidade_id) {
    query.where({ unidade: unidade_id });
  }
  // Pipeline: agrupar por situação e por período (mês+ano), retornando
  // labels no formato "YYYY-MM" e datasets alinhados cronologicamente.
  const aggregate = Pagamento.aggregate([
    {
      $match: {
        $and: [
          query.getQuery(),
          { dataCriacao: { $exists: true, $ne: null } },
        ],
      },
    },
    {
      $project: {
        period: { $dateToString: { format: '%Y-%m', date: '$dataCriacao' } },
        year: { $year: '$dataCriacao' },
        month: { $month: '$dataCriacao' },
        situacaoCodigo: { $ifNull: ['$situacao.codigo', 'DESCONHECIDO'] },
      },
    },
    {
      $group: {
        _id: { situacao: '$situacaoCodigo', period: '$period', year: '$year', month: '$month' },
        count: { $sum: 1 },
      },
    },
    // Ordena por situação e por período cronológico
    { $sort: { '_id.situacao': 1, '_id.year': 1, '_id.month': 1 } },
    {
      $group: {
        _id: '$_id.situacao',
        periods: { $push: { period: '$_id.period', year: '$_id.year', month: '$_id.month', count: '$count' } },
        total: { $sum: '$count' },
      },
    },
    {
      $project: {
        _id: 0,
        situacao: '$_id',
        periods: 1,
        total: 1,
      },
    },
    { $sort: { situacao: 1 } },
  ]);
  aggregate.then((resultado) => {
    // resultado: [{ situacao, periods: [{period, year, month, count}], total }, ...]
    // Construir labels globais (periodos YYYY-MM) e datasets alinhados para Chart.js
    const periodsSet = new Set();
    resultado.forEach((s) => {
      (s.periods || []).forEach(p => periodsSet.add(p.period));
    });

    // Ordenar os periods cronologicamente: 'YYYY-MM' sort lexicograficamente funciona
    const labels = Array.from(periodsSet).sort();

    const datasets = resultado.map((s) => {
      const periodMap = new Map((s.periods || []).map(p => [p.period, p.count]));
      const data = labels.map(period => periodMap.get(period) || 0);
      return {
        label: s.situacao,
        data,
      };
    });

    res.json({ labels, datasets });
  })
    .catch((error) => {
      return next(new ApiError('Erro obtendo estatísticas sobre pagamentos por ano.', 500, error));
    });
};
