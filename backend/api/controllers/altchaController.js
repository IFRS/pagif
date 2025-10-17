import { createChallenge } from 'altcha-lib';

export const challenge = async (req, res, next) => {
  const hmacKey = process.env.ALTCHA_HMAC_KEY;

  try {
    const challenge = await createChallenge({
      hmacKey,
      maxNumber: 1_000_000,
      expires: new Date(Date.now() + 60 * 1000),
    });

    return res.json(challenge);
  } catch (error) {
    next({
      status: 500,
      context: 'Altcha Challenge',
      message: 'Erro ao criar desafio.',
      details: error,
    });
  }
};
