require('../db');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const passport = require('passport');

const health = require('./routes/health');
const info = require('./routes/info');
const unidades = require('./routes/unidades');
const servicos = require('./routes/servicos');
const pagamentos = require('./routes/pagamentos');
const notifica = require('./routes/notifica');
const usuarios = require('./routes/usuarios');
const settings = require('./routes/settings');

const google = require('./auth/google');
const { logger } = require('../logger');

const app = express();

const expire = (process.env.NODE_ENV === 'production') ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 60 * 8; // 7 dias em produção e 8 horas em desenvolvimento

let session_store = new MongoDBStore({
  uri: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  databaseName: process.env.DB_NAME,
  collection: 'sessions',
  expires: expire,
});
session_store.on('error', function(error) {
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
app.use(passport.session());

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
app.use(notifica);
app.use(usuarios);
app.use(settings);

module.exports = {
  path: '/api',
  handler: app,
};
