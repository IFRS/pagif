const { Router } = require('express');

const router = Router();

const servicosController = require('../controllers/servicosController');

router.get('/servicos', servicosController.list);

router.get('/servicos/:id', servicosController.show);

router.post('/servicos', servicosController.save);

router.put('/servicos/:id', servicosController.save);

router.delete('/servicos/:id', servicosController.delete);

module.exports = router;
