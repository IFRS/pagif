import 'dotenv/config';

import { create, deriveHmacKeySecret, randomInt } from 'altcha-lib/frameworks/express';
import { deriveKey } from 'altcha-lib/algorithms/pbkdf2';

const hmacSignatureSecret = process.env.ALTCHA_HMAC_KEY;

if (!hmacSignatureSecret) {
  throw new Error('ALTCHA_HMAC_KEY não configurada.');
}

const createAltcha = async () => {
  const hmacKeySignatureSecret = await deriveHmacKeySecret(hmacSignatureSecret);

  return create({
    fieldName: 'captcha',
    hmacSignatureSecret,
    hmacKeySignatureSecret,
    deriveKey,
    createChallengeParameters: () => ({
      algorithm: 'PBKDF2/SHA-256',
      cost: 5000,
      counter: randomInt(10_000, 5_000),
      expiresAt: new Date(Date.now() + 60 * 1000),
    }),
  });
};

const altchaPromise = createAltcha();

export const challengeHandler = async (req, res, next) => {
  const altcha = await altchaPromise;
  return altcha.challengeHandler(req, res, next);
};

export default async (req, res, next) => {
  const altcha = await altchaPromise;
  return altcha.middleware()(req, res, next);
};
