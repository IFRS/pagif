import { createChallenge } from 'altcha-lib';

// const { logger } = require('../../logger');

const hmacKey = process.env.ALTCHA_HMAC_KEY;

export const challenge = async (req, res) => {
  const challenge = await createChallenge({
    hmacKey,
    maxNumber: 100_000,
  });

  return res.json(challenge);
};
