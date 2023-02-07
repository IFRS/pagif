const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.timestamp({
      format: () => {
        return new Date().toLocaleString('pt-BR', {
          timeZone: 'America/Sao_Paulo'
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
    new winston.transports.File({ filename: 'log/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'log/combined.log' }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'log/exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'log/rejections.log' }),
  ],
});

module.exports = logger;
