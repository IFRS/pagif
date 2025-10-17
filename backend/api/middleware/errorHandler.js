import { logger } from '../../logger/index.js';

export default function (err, req, res) {
  logger.error(`[${err.context}] ${err.message} - %o`, err.details);

  return res.status(err.status || 500).json({
    context: err.context || 'Desconhecido',
    message: err.message || 'Erro interno do servidor.',
    details: err.details || null,
  });
};
