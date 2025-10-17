import Pagamento from '../../db/models/Pagamento.js';
import Servico from '../../db/models/Servico.js';
import validator from 'express-validator';
import pagtesouro from '../pagtesouro.js';
import dayjs from 'dayjs';
import { createMongoAbility } from '@casl/ability';

export const showPublic = function (req, res, next) {
  Pagamento.findById(req.params.id).select('-token -tipoPagamentoEscolhido -nomePSP -transacaoPSP')
    .then((pagamento) => {
      if (!pagamento) {
        next({
          status: 404,
          context: 'Pagamento Público',
          message: 'Pagamento não encontrado.',
        });
      }

      pagamento = pagamento.toObject();

      if (pagamento.cnpjCpf) {
        if (pagamento.cnpjCpf.length === 11) {
          pagamento.cnpjCpf = pagamento.cnpjCpf.replace(/(.{3})(.{3})(.{3})(.{2})/, '***$2$3**');
        } else if (pagamento.cnpjCpf.length === 14) {
          pagamento.cnpjCpf = pagamento.cnpjCpf.replace(/(.{2})(.{3})(.{3})(.{4})(.{2})/, '*****$3$4**');
        }
      }

      return res.json(pagamento);
    })
    .catch((error) => {
      next({
        status: 500,
        context: 'Pagamento Público',
        message: 'Erro obtendo o Pagamento.',
        details: error,
      });
    });
};

export const list = function (req, res, next) {
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

  query.then((pagamentos) => {
    return res.json(pagamentos.map(doc => doc.toJSON()));
  })
    .catch((error) => {
      next({
        status: 500,
        context: 'Pagamentos Lista',
        message: 'Erro obtendo lista de Pagamentos.',
        details: error,
      });
    });
};

export const show = function (req, res, next) {
  Pagamento.findById(req.params.id).select('-token')
    .then((pagamento) => {
      if (!pagamento) {
        next({
          status: 404,
          context: 'Pagamento',
          message: 'Pagamento não encontrado.',
        });
      }

      return res.json(pagamento.toJSON());
    })
    .catch((error) => {
      next({
        status: 500,
        context: 'Pagamento',
        message: 'Erro obtendo o Pagamento.',
        details: error,
      });
    });
};

export const save = [
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
    .isAlphanumeric('pt-BR', { ignore: ' _-' })
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
  function (req, res, next) {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      next({
        status: 422,
        context: 'Salvar Pagamento',
        message: 'Dados inválidos para criação do Pagamento.',
        details: errors.mapped(),
      });
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
      .then((servico) => {
        if (!servico) {
          next({
            status: 500,
            context: 'Salvar Pagamento',
            message: `Serviço de código ${data.codigoServico} não encontrado.`,
          });
        }

        data.token = servico.unidade.token;
        data.unidade = servico.unidade._id;
        data.nomeUnidade = servico.unidade.nome;
        data.nomeServico = servico.nome;

        pagtesouro.post('/api/gru/solicitacao-pagamento', data, { headers: { Authorization: `Bearer ${data.token}` } })
          .then((response) => {
            Object.assign(data, response.data);

            let pagamento = new Pagamento(data);

            pagamento.save()
              .then((pagamento) => {
                return res.json(pagamento.toJSON());
              })
              .catch((error) => {
                next({
                  status: 500,
                  context: 'Salvar Pagamento',
                  message: 'Erro ao salvar o Pagamento.',
                  details: error,
                });
              });
          })
          .catch((error) => {
            next({
              status: 500,
              context: 'Salvar Pagamento',
              message: 'Erro ao solicitar criação do Pagamento.',
              details: error,
            });
          });
      })
      .catch((error) => {
        next({
          status: 500,
          context: 'Salvar Pagamento',
          message: 'Erro ao buscar Serviço.',
          details: error,
        });
      });
  },
];

export const update = function (req, res, next) {
  Pagamento.findById(req.params.id)
    .then((pagamento) => {
      if (!pagamento) {
        next({
          status: 404,
          context: 'Pagamento Atualização',
          message: 'Pagamento não encontrado.',
        });
      }

      pagtesouro.get(`/api/gru/pagamentos/${pagamento.idPagamento}`, { headers: { Authorization: `Bearer ${pagamento.token}` } })
        .then((response) => {
          let pagamentoBeforeSave = pagamento.toJSON();
          Object.assign(pagamento, response.data);
          pagamento.save()
            .then((pagamentoAfterSave) => {
              if (JSON.stringify(pagamentoAfterSave.toJSON()) === JSON.stringify(pagamentoBeforeSave)) return res.status(204).end();
              return res.json(pagamentoAfterSave.toJSON({
                transform: function (doc, ret) {
                  delete ret.token;
                  return ret;
                },
              }));
            })
            .catch((error) => {
              next({
                status: 500,
                context: 'Pagamento Atualização',
                message: 'Erro ao salvar o Pagamento atualizado.',
                details: error,
              });
            });
        })
        .catch((error) => {
          next({
            status: 500,
            context: 'Pagamento Atualização',
            message: 'Erro ao consultar o Pagamento.',
            details: error,
          });
        });
    })
    .catch(() => {
      next({
        status: 500,
        context: 'Pagamento Atualização',
        message: 'Falha ao verificar a situação do pagamento.',
      });
    });
};

export const remove = function (req, res, next) {
  Pagamento.findByIdAndDelete(req.params.id)
    .then((pagamento) => {
      return res.json(pagamento.toJSON());
    })
    .catch((error) => {
      next({
        status: 500,
        context: 'Pagamento Remoção',
        message: 'Erro ao remover o Pagamento.',
        details: error,
      });
    });
};
