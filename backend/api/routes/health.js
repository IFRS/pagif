const db = require('../../db');
const { Router } = require('express');

const router = Router();

router.get('/health', async (req, res) => {
  if (db.readyState) {
    res.status(200).end();
  } else {
    res.status(503).end();
  }
});

module.exports = router;
