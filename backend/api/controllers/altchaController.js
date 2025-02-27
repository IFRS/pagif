import { createChallenge } from 'altcha-lib';

const hmacKey = process.env.ALTCHA_HMAC_KEY;

export const challenge = async (req, res) => {
  const challenge = await createChallenge({
    hmacKey,
    maxNumber: 1_000_000,
    expires: new Date(Date.now() + 60 * 1000),
  });

  return res.json(challenge);
};
