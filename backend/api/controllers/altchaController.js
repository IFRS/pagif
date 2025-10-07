import { createChallenge } from 'altcha-lib';

export const challenge = async (req, res) => {
  const hmacKey = process.env.ALTCHA_HMAC_KEY;

  const challenge = await createChallenge({
    hmacKey,
    maxNumber: 1_000_000,
    expires: new Date(Date.now() + 60 * 1000),
  });

  return res.json(challenge);
};
