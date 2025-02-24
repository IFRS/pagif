import 'dotenv/config';
import { accessibleRecordsPlugin } from '@casl/mongoose';
import mongoose from 'mongoose';
import { logger } from '../logger/index.js';

mongoose.plugin(accessibleRecordsPlugin);

mongoose.set('strictQuery', true);

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`).then(
  () => {
    mongoose.connection.on('error', (error) => {
      logger.error('Erro no MongoDB: %o', error);
    });
  },
  (error) => {
    logger.error('Erro ao tentar conectar no MongoDB: %o', error);
  },
);

export default mongoose.connection;
