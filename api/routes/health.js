const db = require('../../db');
const { Router } = require('express');
const requireAbility = require('../middleware/requireAbility');

const router = Router();

router.get('/health', async (req, res) => {
  res.status(200).end();
});

router.get('/health/db', requireAbility(), async (req, res) => {
  if (db.readyState) {
    res.status(200).end();
  } else {
    res.status(503).end();
  }
});

module.exports = router;
