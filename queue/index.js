const { Agenda } = require('@hokify/agenda');
const mongo = require('../db');
const Pagamento = require('../db/models/Pagamento');
const pagtesouro = require('../api/pagtesouro');
const {logger} = require('../logger');

const agenda = new Agenda({mongo: mongo, db: { collection: 'jobs' }, processEvery: '5 minute'});

agenda.define('update pagamentos', async job => {
  const { idPagamento } = job.attrs.data;

	logger.info('[Fila] Iniciando tarefa para o Pagamento %s', idPagamento);

  await Pagamento.findById(idPagamento).exec(async (err, pagamento) => {
    if (err || !pagamento) {
      log.error('[Fila] Erro ao obter Pagamento.');
      await job.fail('Erro ao obter Pagamento. ' + err);
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
        log.error('[Fila] Erro ao atualizar o pagamento.');
        await job.fail('Erro atualizando o pagamento. ' + error);
        await job.save();
      });
    })
    .catch(async (error) => {
      log.error('[Fila] Erro consultando o Pagamento.');
      await job.fail('Erro consultando o Pagamento. ' + error);
      await job.save();
    });
  });
});

module.exports = agenda;
