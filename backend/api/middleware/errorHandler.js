import { logger } from '../../logger/index.js';

// eslint-disable-next-line no-unused-vars
export default function (err, req, res, next) {
  if (err.status?.toString().startsWith('4')) {
    logger.warn(`${err.message} %o`, err.details);
  } else {
    logger.error(`${err.message} %o`, err.details);
  }

  return res.status(err.status || 500).json({
    message: err.message ?? 'Erro interno do servidor.',
    details: err.details ?? undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
