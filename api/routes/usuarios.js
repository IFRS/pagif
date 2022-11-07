const { Router } = require('express');
const requireAbility = require('../middleware/requireAbility');

const router = Router();

const usuariosController = require('../controllers/usuariosController');

router.get('/usuarios', requireAbility(['read', 'Usuario']), usuariosController.list);

router.get('/usuarios/:id', requireAbility(['read', 'Usuario']), usuariosController.show);

router.post('/usuarios', requireAbility(['create', 'Usuario']), usuariosController.save);

router.put('/usuarios/:id', requireAbility(['update', 'Usuario']), usuariosController.save);

router.delete('/usuarios/:id', requireAbility(['delete', 'Usuario']), usuariosController.delete);

module.exports = router;
