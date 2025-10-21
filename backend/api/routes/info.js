import { Router } from 'express';
import requireAbility from '../middleware/requireAbility.js';

import { count, pagamentos_por_tipo, pagamentos_por_servicos, pagamentos_por_mes_ano } from '../controllers/infoController.js';

const router = Router();

router.get('/info/count', requireAbility(), count);

router.get('/info/pagamentos_por_tipo', requireAbility(), pagamentos_por_tipo);

router.get('/info/pagamentos_por_servicos', requireAbility(), pagamentos_por_servicos);

router.get('/info/pagamentos_por_mes_ano', requireAbility(), pagamentos_por_mes_ano);

export default router;
