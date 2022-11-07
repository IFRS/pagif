const { Router } = require('express');
const requireAbility = require('../middleware/requireAbility');
const recaptcha = require('../middleware/recaptcha');

const router = Router();

const pagamentosController = require('../controllers/pagamentosController');

router.get('/public/pagamentos/:id', pagamentosController.showPublic);

router.get('/pagamentos', requireAbility(['read', 'Pagamento']), pagamentosController.list);

router.get('/pagamentos/:id', requireAbility(['read', 'Pagamento']), pagamentosController.show);

router.post('/pagamentos', requireAbility(['create', 'Pagamento']), pagamentosController.save);

router.post('/public/pagamentos', recaptcha, pagamentosController.save);

router.put('/pagamentos/:id', requireAbility(['update', 'Pagamento']), pagamentosController.update);

router.delete('/pagamentos/:id', requireAbility(['delete', 'Pagamento']), pagamentosController.delete);

module.exports = router;
