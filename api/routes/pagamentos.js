const { Router } = require('express');

const router = Router();

const pagamentosController = require('../controllers/pagamentosController');

router.get('/pagamentos', pagamentosController.list);

router.get('/pagamentos/:id', pagamentosController.show);

router.post('/pagamentos', pagamentosController.save);

router.put('/pagamentos/:id', pagamentosController.update);

router.delete('/pagamentos/:id', pagamentosController.delete);

module.exports = router;
