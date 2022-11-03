const { Router } = require('express');
const permissions = require('../middleware/permissions');
const { ADMIN, GERENTE } = require('../../db/roles');

const router = Router();

const servicosController = require('../controllers/servicosController');

router.get('/servicos', permissions([ADMIN.role, GERENTE.role]), servicosController.list);

router.get('/servicos/:id', permissions([ADMIN.role]), servicosController.show);

router.post('/servicos', permissions([ADMIN.role]), servicosController.save);

router.put('/servicos/:id', permissions([ADMIN.role]), servicosController.save);

router.delete('/servicos/:id', permissions([ADMIN.role]), servicosController.delete);

module.exports = router;
