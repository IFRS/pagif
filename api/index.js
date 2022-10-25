require('../db');
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');

const app = express();

let session_store = new MongoDBStore({
  uri: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  databaseName: process.env.DB_NAME,
  collection: 'sessions',
});
session_store.on('error', function(error) {
  console.error(error);
});

app.use(cors({
  origin: process.env.BROWSER_BASE_URL,
  optionsSuccessStatus: 200,
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  store: session_store,
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.session());

const unidades = require('./routes/unidades');
const servicos = require('./routes/servicos');
const pagamentos = require('./routes/pagamentos');
const notifica = require('./routes/notifica');
const info = require('./routes/info');

const google = require('./auth/google');

app.use(google);

// Add development latency
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => setTimeout(next, 999));
}

app.use(unidades);
app.use(servicos);
app.use(pagamentos);
app.use(notifica);
app.use(info);

module.exports = {
  path: '/api',
  handler: app,
};
