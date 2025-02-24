import { Router } from 'express';
import requireAbility from '../middleware/requireAbility.js';

import { count, pagamentos_por_tipo, pagamentos_por_servicos } from '../controllers/infoController.js';

const router = Router();

router.get('/info/count', requireAbility(), count);

router.get('/info/pagamentos_por_tipo', requireAbility(), pagamentos_por_tipo);

router.get('/info/pagamentos_por_servicos', requireAbility(), pagamentos_por_servicos);

export default router;
