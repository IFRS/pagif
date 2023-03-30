const Pagamento = require('../../db/models/Pagamento');
const validator = require('express-validator');
const agenda = require('../../queue');
const { loggerPagTesouro, logger } = require('../../logger');

module.exports.handle = [
  validator.body('idPagamento', 'Identificador do Pagamento está num formato inválido.')
    .trim()
    .notEmpty()
    .isAlphanumeric()
    .isLength({ max: 50 }),
  validator.body('dataHora', 'Data e Hora da notificação está em um formato inválido.')
    .trim()
    .notEmpty()
    .isISO8601(),
  function(req, res) {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      let errorList = [];

      errors.array().forEach((error) => {
        errorList.push({
          codigo: 'C0007',
          descricao: error.msg,
        });
      });

      return res.status(422).json(errorList);
    }

    const authorization_header = req.headers['authorization'];
    let bearer_token = null;

    if (authorization_header) {
      const bearer = authorization_header.split(' ');

      if (bearer[0] === 'Bearer') {
        bearer_token = bearer[1];
      }
    }

    loggerPagTesouro.info('[Notificação Recebida] %o', req.body);

    Pagamento.findById(req.body.idPagamento)
    .then(async pagamento => {
      if (!pagamento) {
        return res.status(422).json([{
          codigo: 'C0023',
          descricao: 'Pagamento inexistente.',
        }]);
      }

      if (pagamento.token && pagamento.token !== bearer_token) {
        return res.status(422).json([{
          codigo: 'C0035',
          descricao: 'Token de autenticação inválido ou inexistente.',
        }]);
      }

      try {
        let tarefa = agenda.create('update pagamentos', {idPagamento: pagamento._id});
        await tarefa.save();

        logger.info('[Fila] Tarefa adicionada para o Pagamento %s', pagamento._id);

        return res.status(200).end();
      } catch (error) {
        logger.error('[Fila] Erro adicionando tarefa: %o', error);
        return res.status(500).end();
      }
    })
    .catch(error => {
      console.error(error);
      return res.status(500).json([{
        codigo: 'C0027',
        descricao: 'Falha ao verificar a situação do pagamento.',
      }]);
    });
  }
];
