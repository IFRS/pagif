import { createChallenge } from 'altcha-lib';
import { ApiError } from '../utils/ApiError.js';

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
    return next(new ApiError('Erro ao criar desafio do ALTCHA.', 500, error));
  }
};
