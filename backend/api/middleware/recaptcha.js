import axios from 'axios';

export default function (req, res, next) {
  if (req.body.recaptcha) {
    axios.get('https://www.google.com/recaptcha/api/siteverify', { params: { secret: process.env.RECAPTCHA_SECRET, response: req.body.recaptcha } })
      .then((response) => {
        if (response.data.success) {
          next();
        } else {
          return res.status(412).json({
            message: 'Verificação de CAPTCHA falhou.',
          });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          message: 'Erro na verificação de CAPTCHA.',
          error: err,
        });
      });
  } else {
    return res.status(412).json({
      message: 'Token RECAPTCHA não encontrado.',
    });
  }
};
