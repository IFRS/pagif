import { Router } from 'express';
import requireAbility from '../middleware/requireAbility.js';

import { listPublic, showPublic, list, show, token, save, remove } from '../controllers/unidadesController.js';

const router = Router();

router.get('/public/unidades', listPublic);

router.get('/public/unidades/:id', showPublic);

router.get('/unidades', requireAbility(['read', 'Unidade']), list);

router.get('/unidades/:id', requireAbility(['read', 'Unidade']), show);

router.get('/unidades/token/:id', requireAbility(['read', 'UnidadeToken']), token);

router.post('/unidades', requireAbility(['create', 'Unidade']), save);

router.put('/unidades/:id', requireAbility(['update', 'Unidade']), save);

router.delete('/unidades/:id', requireAbility(['delete', 'Unidade']), remove);

export default router;
