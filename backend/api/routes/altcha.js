import { Router } from 'express';

import { challenge } from '../controllers/altchaController.js';

const router = Router();

router.get('/altcha/challenge', challenge);

export default router;
