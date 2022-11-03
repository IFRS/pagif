const { Router } = require('express');
const permissions = require('../middleware/permissions');

const router = Router();

const usuariosController = require('../controllers/usuariosController');

router.get('/usuarios', permissions(null, true), usuariosController.list);

router.get('/usuarios/:id', permissions(null, true), usuariosController.show);

router.post('/usuarios', permissions(null, true), usuariosController.save);

router.put('/usuarios/:id', permissions(null, true), usuariosController.save);

router.delete('/usuarios/:id', permissions(null, true), usuariosController.delete);

module.exports = router;
