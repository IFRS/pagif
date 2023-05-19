const { Router } = require('express');

const router = Router();

const notificaController = require('../controllers/notificaController');

router.post('/notifica', notificaController.handle);

module.exports = router;
