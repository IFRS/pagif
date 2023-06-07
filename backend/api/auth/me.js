const { Router } = require('express');
const router = Router();

router.get('/auth/me', function(req, res) {
  return res.json(req.session?.user || null);
});

module.exports = router;
