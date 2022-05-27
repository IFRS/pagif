const express = require('express');
const db = require('./db');

// Create express instance
const app = express();

// Init body-parser options (inbuilt with express)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Require & Import API routes
const pagar = require('./routes/pagar');

// Use API Routes
app.use(pagar);

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app,
};
