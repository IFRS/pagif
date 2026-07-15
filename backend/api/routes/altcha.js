import { Router } from 'express';

import { challengeHandler } from '../middleware/altcha.js';

const router = Router();

router.get('/altcha/challenge', challengeHandler);

export default router;
