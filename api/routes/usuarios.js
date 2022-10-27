const { Router } = require('express');

const router = Router();

const usuariosController = require('../controllers/usuariosController');

router.get('/usuarios', usuariosController.list);

router.get('/usuarios/:id', usuariosController.show);

router.post('/usuarios', usuariosController.save);

router.put('/usuarios/:id', usuariosController.save);

router.delete('/usuarios/:id', usuariosController.delete);

module.exports = router;
