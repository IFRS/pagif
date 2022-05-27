const { Router } = require('express');

const router = Router();

const unidadesController = require('../controllers/unidadesController');

router.get('/unidades', unidadesController.list);

router.get('/unidades/:id', unidadesController.show);

router.post('/unidades', unidadesController.save);

router.put('/unidades/:id', unidadesController.save);

router.delete('/unidades/:id', unidadesController.delete);

module.exports = router;
