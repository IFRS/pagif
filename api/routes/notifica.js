const { Router } = require('express');

const router = Router();

const notificaController = require('../controllers/notificaController');
const pagamentosController = require('../controllers/pagamentosController');

router.post('/notifica', notificaController.handle, pagamentosController.update);

module.exports = router;
