const express = require('express');
const db = require('./db');

// Create express instance
const app = express();

// Init body-parser options (inbuilt with express)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Require & Import API routes
const pagar = require('./routes/pagar');
const unidades = require('./routes/unidades');

// Use API Routes
app.use(pagar);
app.use(unidades);

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app,
};
