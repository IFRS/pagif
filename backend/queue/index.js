import { Pulse } from '@pulsecron/pulse';
import mongo from '../db/index.js';
import Pagamento from '../db/models/Pagamento.js';
import pagtesouro from '../api/pagtesouro.js';
import { logger } from '../logger/index.js';
import dayjs from 'dayjs';

const pulse = new Pulse({ mongo: mongo, db: { collection: 'jobs' }, processEvery: '5 minutes' });

pulse.define('update pagamentos', async (job) => {
  const { idPagamento } = job.attrs.data;

  logger.info('[Fila] Iniciando atualização do Pagamento %s', idPagamento);

  await Pagamento.findById(idPagamento)
    .then(async (pagamento) => {
      if (!pagamento) {
        logger.error('[Fila] Pagamento %s não encontrado.', idPagamento);
        job.fail('Pagamento não encontrado.');
        await job.save();
        return;
      }

      await pagtesouro.get(`/api/gru/pagamentos/${pagamento.idPagamento}`, { headers: { Authorization: `Bearer ${pagamento.token}` } })
        .then(async (response) => {
          Object.assign(pagamento, response.data);
          await pagamento.save()
            .then(async () => {
              await job.remove();
              logger.info('[Fila] Pagamento %s atualizado!', pagamento.idPagamento);
            })
            .catch(async (error) => {
              logger.error('[Fila] Erro ao atualizar o pagamento %s: %o', pagamento.idPagamento, error);
              job.fail('Erro ao atualizar o pagamento. ' + error);
              await job.save();
            });
        })
        .catch(async (error) => {
          logger.error('[Fila] Erro ao consultar o Pagamento %s: %o', idPagamento, error);
          job.fail('Erro ao consultar o Pagamento. ' + error);
          await job.save();
        });
    })
    .catch(async (error) => {
      logger.error('[Fila] Erro ao obter Pagamento %s: %o', idPagamento, error);
      job.fail('Erro ao obter Pagamento. ' + error);
      await job.save();
    });
}, {
  attempts: 10,
  backoff: {
    type: 'exponential',
    delay: 60000,
  },
});

// Pulsecron scheduled job: define a hourly job that will look for
// Pagamentos with situacao.codigo === 'CRIADO' older than 7 days and
// enqueue up to QUEUE_LIMIT items into 'update pagamentos'
pulse.define('enqueue pagamentos without update', async () => {
  const limit = parseInt(process.env.QUEUE_LIMIT || '5', 10);

  try {
    const sevenDaysAgo = dayjs().subtract(7, 'day').toDate();

    logger.info('[Fila] Agendador de Pagamentos pendentes: buscando Pagamentos com status "CRIADO" anteriores a %s (limite de %d)', sevenDaysAgo, limit);

    // Require Pulse API to query existing jobs to avoid duplicate enqueues.
    const queuedIdsSet = new Set();
    if (typeof pulse.jobs !== 'function') {
      logger.error('[Fila] Agendador de Pagamentos pendentes: API pulse.jobs() não disponível — abortando para evitar duplicação de tarefas.');
      return;
    }

    try {
      const existingJobs = await pulse.jobs({ name: 'update pagamentos' });
      if (Array.isArray(existingJobs)) {
        existingJobs.forEach((j) => {
          const id = j?.attrs?.data?.idPagamento ?? j?.data?.idPagamento ?? j?.idPagamento;
          if (id) queuedIdsSet.add(String(id));
        });
      }
    } catch (e) {
      logger.error('[Fila] Agendador de Pagamentos pendentes: erro ao listar jobs via Pulse — abortando para evitar duplicação: %o', e);
      return;
    }

    // Build query and exclude already-queued pagamentos. Order by dataCriacao (oldest first).
    const query = {
      'situacao.codigo': 'CRIADO',
      'dataCriacao': { $exists: true, $lt: sevenDaysAgo },
    };

    if (queuedIdsSet.size > 0) query._id = { $nin: Array.from(queuedIdsSet) };

    const pagamentos = await Pagamento.find(query).sort({ dataCriacao: 1 }).limit(limit).exec();

    if (!pagamentos || pagamentos.length === 0) {
      logger.info('[Fila] Agendador de Pagamentos pendentes: nenhum pagamento elegível encontrado.');
      return;
    }

    for (let i = 0; i < pagamentos.length; i++) {
      const pagamento = pagamentos[i];

      try {
        const tarefa = pulse.create('update pagamentos', { idPagamento: pagamento._id });

        await tarefa.save();

        logger.info('[Fila] Agendador de Pagamentos pendentes: tarefa adicionada para o Pagamento %s (posição %d)', pagamento._id, i + 1);
      } catch (err) {
        logger.error('[Fila] Agendador de Pagamentos pendentes: erro adicionando tarefa para o Pagamento %s: %o', pagamento._id, err);
      }
    }
  } catch (error) {
    logger.error('[Fila] Agendador de Pagamentos pendentes: falha ao buscar ou enfileirar Pagamentos: %o', error);
  }
});

// Ensure there is a single repeating Pulse job scheduled for the hourly enqueue.
try {
  pulse.every('hour', 'enqueue pagamentos without update', {});
  logger.info('[Fila] Agendador de Pagamentos pendentes: agendado com intervalo de 1 hora.');
} catch (err) {
  logger.error('[Fila] Agendador de Pagamentos pendentes: com erro de agendamento: %o', err);
}

export default pulse;
