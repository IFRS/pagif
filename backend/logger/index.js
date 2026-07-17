import 'dotenv/config';
import winston from 'winston';
import path from 'node:path';

const logLevel = process.env.LOG_LEVEL || 'info';
const shouldLogToFile = process.env.LOG_TO_FILE === 'true';

const pagTesouroTransports = [new winston.transports.Console()];
const geralTransports = [new winston.transports.Console({ level: logLevel })];
const exceptionHandlers = [new winston.transports.Console({ level: logLevel })];
const rejectionHandlers = [new winston.transports.Console({ level: logLevel })];

if (shouldLogToFile) {
  pagTesouroTransports.push(new winston.transports.File({ filename: path.resolve('logs/pagtesouro.log'), maxsize: 10000000, maxFiles: 10, tailable: true }));
  geralTransports.push(new winston.transports.File({ filename: path.resolve('logs/error.log'), level: 'error' }));
  geralTransports.push(new winston.transports.File({ filename: path.resolve('logs/all.log') }));
  exceptionHandlers.push(new winston.transports.File({ filename: path.resolve('logs/exceptions.log') }));
  rejectionHandlers.push(new winston.transports.File({ filename: path.resolve('logs/rejections.log') }));
}

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
  transports: pagTesouroTransports,
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
  transports: geralTransports,
  exceptionHandlers,
  rejectionHandlers,
});

const loggerPagTesouro = winston.loggers.get('pagtesouro');
const logger = winston.loggers.get('geral');

export { loggerPagTesouro, logger };
