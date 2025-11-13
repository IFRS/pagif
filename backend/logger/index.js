import winston from 'winston';
import path from 'node:path';

winston.loggers.add('pagtesouro', {
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.timestamp(),
    winston.format.printf((info) => {
      if (typeof info.message === 'object') {
        info.message = JSON.stringify(info.message, null, 2);
      }

      return `(${info.timestamp}) ${info.level} ${info.message.replace(/\n/g, ' ')}\n`;
    }),
  ),
  transports: [
    new winston.transports.File({ filename: path.resolve('logs/pagtesouro.log'), maxsize: 10000000, maxFiles: 10, tailable: true }),
  ],
});

winston.loggers.add('geral', {
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.timestamp({
      format: () => {
        return new Date().toLocaleString('pt-BR', {
          timeZone: 'America/Sao_Paulo',
        });
      },
    }),
    winston.format.printf((info) => {
      if (typeof info.message === 'object') {
        info.message = JSON.stringify(info.message, null, 2);
      }

      return `(${info.timestamp}) ${info.level} ${info.message}`;
    }),
  ),
  transports: [
    new winston.transports.File({ filename: path.resolve('logs/error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.resolve('logs/all.log') }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: path.resolve('logs/exceptions.log') }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: path.resolve('logs/rejections.log') }),
  ],
});

const loggerPagTesouro = winston.loggers.get('pagtesouro');
const logger = winston.loggers.get('geral');

export { loggerPagTesouro, logger };
