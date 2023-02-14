const { Router } = require('express');

const router = Router();

const settingsController = require('../controllers/settingsController');

router.get('/public/settings', settingsController.showPublic);

router.post('/settings', settingsController.save);

module.exports = router;
