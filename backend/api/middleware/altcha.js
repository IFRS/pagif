import { verifySolution } from 'altcha-lib';
import { logger } from '../../logger/index.js';

export default function (req, res, next) {
  const hmacKey = process.env.ALTCHA_HMAC_KEY;
  const payload = req.body?.captcha;

  if (!payload) {
    logger.warn('[ALTCHA] Payload de captcha ausente.');
    return res.status(422).end();
  }

  verifySolution(payload, hmacKey)
    .then(() => next())
    .catch((altchaError) => {
      logger.warn('[ALTCHA] Solução inválida: %o', altchaError);
      return res.status(422).end();
    });
};
