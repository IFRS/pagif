import { Router } from 'express';

import { show, save } from '../controllers/settingsController.js';

const router = Router();

router.get('/public/settings', show);

router.get('/settings', show);

router.post('/settings', save);

export default router;
