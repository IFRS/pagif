const { Router } = require('express');

const router = Router();

// Initialize Controller
const pagtesouroController = require('../controllers/pagtesouroController');

// Create
router.post('/pagar', pagtesouroController.pagar);

module.exports = router;
