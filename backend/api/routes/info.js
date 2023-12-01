const { Router } = require('express');
const requireAbility = require('../middleware/requireAbility');

const router = Router();

const infoController = require('../controllers/infoController.js');

router.get('/info/count', requireAbility(), infoController.count);

router.get('/info/pagamentos_por_tipo', requireAbility(), infoController.pagamentos_por_tipo);

router.get('/info/pagamentos_por_servicos', requireAbility(), infoController.pagamentos_por_servicos);

module.exports = router;
