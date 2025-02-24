import { Router } from 'express';
import requireAbility from '../middleware/requireAbility.js';

import { listPublic, list, show, save, remove } from '../controllers/servicosController.js';

const router = Router();

router.get('/public/servicos', listPublic);

router.get('/servicos', requireAbility(['read', 'Servico']), list);

router.get('/servicos/:id', requireAbility(['read', 'Servico']), show);

router.post('/servicos', requireAbility(['create', 'Servico']), save);

router.put('/servicos/:id', requireAbility(['update', 'Servico']), save);

router.delete('/servicos/:id', requireAbility(['delete', 'Servico']), remove);

export default router;
