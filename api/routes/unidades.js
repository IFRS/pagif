const { Router } = require('express');
const requireAbility = require('../middleware/requireAbility');

const router = Router();

const unidadesController = require('../controllers/unidadesController');

router.get('/public/unidades', unidadesController.listPublic);

router.get('/public/unidades/:id', unidadesController.showPublic);

router.get('/unidades', requireAbility(['read', 'Unidade']), unidadesController.list);

router.get('/unidades/:id', requireAbility(['read', 'Unidade']), unidadesController.show);

router.get('/unidades/token/:id', requireAbility(['read', 'UnidadeToken']), unidadesController.token);

router.post('/unidades', requireAbility(['create', 'Unidade']), unidadesController.save);

router.put('/unidades/:id', requireAbility(['update', 'Unidade']), unidadesController.save);

router.delete('/unidades/:id', requireAbility(['delete', 'Unidade']), unidadesController.delete);

module.exports = router;
