import { Router } from 'express';

import { handle } from '../controllers/notificaController.js';

const router = Router();

router.post('/notifica', handle);

export default router;
