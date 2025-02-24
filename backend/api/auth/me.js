import { Router } from 'express';
const router = Router();

router.get('/auth/me', function (req, res) {
  return res.json(req.session?.user || null);
});

export default router;
