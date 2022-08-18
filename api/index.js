const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();


app.use(cors({
  origin: process.env.BROWSER_BASE_URL,
  optionsSuccessStatus: 200,
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const unidades = require('./routes/unidades');
const servicos = require('./routes/servicos');
const pagamentos = require('./routes/pagamentos');
const notifica = require('./routes/notifica');

// Add development latency
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => setTimeout(next, 999));
}

app.use(unidades);
app.use(servicos);
app.use(pagamentos);
app.use(notifica);

module.exports = {
  path: '/api',
  handler: app,
};
