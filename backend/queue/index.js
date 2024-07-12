const { Pulse } = require('@pulsecron/pulse');
const mongo = require('../db');
const Pagamento = require('../db/models/Pagamento');
const pagtesouro = require('../api/pagtesouro');
const { logger } = require('../logger');

const pulse = new Pulse({mongo: mongo, db: { collection: 'jobs' }, processEvery: '5 minutes'});

pulse.define('update pagamentos', async job => {
  const { idPagamento } = job.attrs.data;

	logger.info('[Fila] Iniciando atualização do Pagamento %s', idPagamento);

  await Pagamento.findById(idPagamento)
  .then(async pagamento => {
    if (!pagamento) {
      logger.error('[Fila] Pagamento não encontrado.');
      await job.fail('Pagamento não encontrado.');
      await job.save();
    }

    await pagtesouro.get(`/api/gru/pagamentos/${pagamento.idPagamento}`, { headers: {'Authorization': `Bearer ${pagamento.token}`} })
    .then(async (response) => {
      Object.assign(pagamento, response.data);
      await pagamento.save()
      .then(async () => {
        await job.remove();
        logger.info('[Fila] Pagamento %s atualizado!', pagamento.idPagamento);
      })
      .catch(async (error) => {
        logger.error('[Fila] Erro ao atualizar o pagamento.');
        await job.fail('Erro ao atualizar o pagamento. ' + error);
        await job.save();
      });
    })
    .catch(async (error) => {
      logger.error('[Fila] Erro ao consultar o Pagamento.');
      await job.fail('Erro ao consultar o Pagamento. ' + error);
      await job.save();
    });
  })
  .catch(async error => {
    logger.error('[Fila] Erro ao obter Pagamento.');
    await job.fail('Erro ao obter Pagamento. ' + error);
    await job.save();
  });
}, {
  attempts: 10,
  backoff: {
    type: 'exponential',
    delay: 60000,
  },
});

module.exports = pulse;
