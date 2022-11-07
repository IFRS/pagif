const { Router } = require('express');
const requireAbility = require('../middleware/requireAbility');

const router = Router();

const servicosController = require('../controllers/servicosController');

router.get('/public/servicos', servicosController.listPublic);

router.get('/servicos', requireAbility(['read', 'Servico']), servicosController.list);

router.get('/servicos/:id', requireAbility(['read', 'Servico']), servicosController.show);

router.post('/servicos', requireAbility(['create', 'Servico']), servicosController.save);

router.put('/servicos/:id', requireAbility(['update', 'Servico']), servicosController.save);

router.delete('/servicos/:id', requireAbility(['delete', 'Servico']), servicosController.delete);

module.exports = router;
