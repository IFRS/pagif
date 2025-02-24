import { verifySolution } from 'altcha-lib';
import { logger } from '../../logger/index.js';

export default function (req, res, next) {
  const hmacKey = process.env.ALTCHA_HMAC_KEY;
  const payload = req.body.captcha;

  verifySolution(payload, hmacKey)
    .then(() => next())
    .catch((altchaError) => {
      logger.warning('[ALTCHA] Invalid solution: %o', altchaError);
      return res.status(422).end();
    });
};
