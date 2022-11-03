const { Router } = require('express');
const permissions = require('../middleware/permissions');

const router = Router();

const unidadesController = require('../controllers/unidadesController');

router.get('/unidades', unidadesController.list);

router.get('/unidades', permissions(null, true), unidadesController.list);

router.get('/unidades/:id', permissions(null, true), unidadesController.show);

router.get('/unidades/token/:id', permissions(null, true), unidadesController.token);

router.post('/unidades', permissions(null, true), unidadesController.save);

router.put('/unidades/:id', permissions(null, true), unidadesController.save);

router.delete('/unidades/:id', permissions(null, true), unidadesController.delete);

module.exports = router;
