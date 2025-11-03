import db from '../../db/index.js';
import { Router } from 'express';

const router = Router();

router.get('/health', async (req, res) => {
  if (db.readyState) {
    res.status(200).end();
  } else {
    res.status(503).end();
  }
});

export default router;
