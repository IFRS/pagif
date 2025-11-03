import { Router } from 'express';
import requireAbility from '../middleware/requireAbility.js';
import altcha from '../middleware/altcha.js';

import { showPublic, list, show, save, update, remove } from '../controllers/pagamentosController.js';

const router = Router();

router.get('/public/pagamentos/:id', showPublic);

router.get('/pagamentos', requireAbility(['read', 'Pagamento']), list);

router.get('/pagamentos/:id', requireAbility(['read', 'Pagamento']), show);

router.post('/pagamentos', requireAbility(['create', 'Pagamento']), save);

router.post('/public/pagamentos', altcha, save);

router.put('/pagamentos/:id', requireAbility(['update', 'Pagamento']), update);

router.delete('/pagamentos/:id', requireAbility(['delete', 'Pagamento']), remove);

export default router;
