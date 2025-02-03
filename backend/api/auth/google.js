const { Router } = require('express');
const router = Router();
const { OAuth2Client } = require('google-auth-library');
const Usuario = require('../../db/models/Usuario');

router.post('/auth/google/login', async function (req, res) {
  if (req.body.client_id && req.body.credential) {
    const client = new OAuth2Client(req.body.client_id);
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
    });
    const userInfo = ticket.getPayload();

    if (!userInfo.email_verified || !userInfo.hd?.endsWith('ifrs.edu.br')) return res.status(406).end();

    Usuario.findOne({ email: userInfo.email })
      .then(async (usuario) => {
        if (!usuario) return res.status(404).end();

        usuario.nome = userInfo.name;

        if (userInfo.picture) usuario.foto = userInfo.picture;

        await usuario.save();

        req.session.cookie.maxAge = userInfo.exp;
        req.session.user = usuario.toJSON();

        return res.json(usuario.toJSON());
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).send(error);
      });
  }
});

router.get('/auth/google/logout', function (req, res) {
  if (req.session) {
    return req.session.destroy(function (err) {
      if (err) return res.status(500).send(err);
      return res.status(200).end();
    });
  }
  return res.status(405).end();
});

module.exports = router;
