const { Router } = require('express');

const router = Router();

const pagtesouroController = require('../controllers/pagtesouroController');

router.post('/pagar', pagtesouroController.pagar);

module.exports = router;
