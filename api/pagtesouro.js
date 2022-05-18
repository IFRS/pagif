const axios = require('axios');

module.exports = axios.create({
  baseURL: process.env.PAGTESOURO_URL,
  headers: {
    common: {
      'Authorization': `Bearer ${process.env.PAGTESOURO_TOKEN}`,
    },
  },
});
