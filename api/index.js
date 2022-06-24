const express = require('express');
const db = require('./db');

// Create express instance
const app = express();

// Init body-parser options (inbuilt with express)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Require & Import API routes
const unidades = require('./routes/unidades');
const servicos = require('./routes/servicos');
const pagamentos = require('./routes/pagamentos');
const notifica = require('./routes/notifica');

// Add development latency
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => setTimeout(next, 999));
}

// Use API Routes
app.use(unidades);
app.use(servicos);
app.use(pagamentos);
app.use(notifica);

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app,
};
