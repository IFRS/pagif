import 'dotenv/config';
import '../db/index.js';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import MongoDBStore from 'connect-mongodb-session';

import health from './routes/health.js';
import info from './routes/info.js';
import unidades from './routes/unidades.js';
import servicos from './routes/servicos.js';
import pagamentos from './routes/pagamentos.js';
import altcha from './routes/altcha.js';
import notifica from './routes/notifica.js';
import usuarios from './routes/usuarios.js';
import settings from './routes/settings.js';

import errorHandler from './middleware/errorHandler.js';

import me from './auth/me.js';
import google from './auth/google.js';

import { logger } from '../logger/index.js';

const app = express();

const expire = (process.env.NODE_ENV === 'production') ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 60 * 8; // 7 dias em produção e 8 horas em desenvolvimento

const MongoStore = MongoDBStore(session);

let session_store = new MongoStore({
  uri: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  databaseName: process.env.DB_NAME,
  collection: 'sessions',
  expires: expire,
});
session_store.on('error', function (error) {
  logger.error('Erro na sessão: %o', error);
});

app.use(cors({
  origin: process.env.BROWSER_BASE_URL,
  optionsSuccessStatus: 200,
}));
app.use(helmet());
app.use(express.json({ limit: '1.1mb' }));
app.use(express.urlencoded({ limit: '1.1mb', extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: expire,
  },
  store: session_store,
  resave: true,
  saveUninitialized: true,
}));

app.use(me);
app.use(google);

// Add development latency
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => setTimeout(next, 999));
}

app.use(health);
app.use(info);
app.use(unidades);
app.use(servicos);
app.use(pagamentos);
app.use(altcha);
app.use(notifica);
app.use(usuarios);
app.use(settings);

app.use(errorHandler);

export default app;
