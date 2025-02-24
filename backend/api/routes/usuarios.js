import { Router } from 'express';
import requireAbility from '../middleware/requireAbility.js';

import { list, show, save, remove } from '../controllers/usuariosController.js';

const router = Router();

router.get('/usuarios', requireAbility(['read', 'Usuario']), list);

router.get('/usuarios/:id', requireAbility(['read', 'Usuario']), show);

router.post('/usuarios', requireAbility(['create', 'Usuario']), save);

router.put('/usuarios/:id', requireAbility(['update', 'Usuario']), save);

router.delete('/usuarios/:id', requireAbility(['delete', 'Usuario']), remove);

export default router;
