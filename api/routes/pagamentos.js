const { Router } = require('express');
const recaptcha = require('../middleware/recaptcha');
const permissions = require('../middleware/permissions');
const { ADMIN, GERENTE, USER } = require('../../db/roles');

const router = Router();

const pagamentosController = require('../controllers/pagamentosController');

router.get('/pagamentos', permissions([ADMIN.role, GERENTE.role, USER.role]), pagamentosController.list);

router.get('/pagamentos/:id', permissions([ADMIN.role, GERENTE.role, USER.role]), pagamentosController.show);

router.post('/pagamentos', permissions([ADMIN.role, GERENTE.role]), pagamentosController.save);

router.post('/public/pagamentos', recaptcha, pagamentosController.save);

router.put('/pagamentos/:id', permissions([ADMIN.role, GERENTE.role]), pagamentosController.update);

router.delete('/pagamentos/:id', permissions([ADMIN.role, GERENTE.role]), pagamentosController.delete);

module.exports = router;
