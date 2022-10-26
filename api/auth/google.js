const { Router } = require('express');
const router = Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Usuario = require('../../db/models/Usuario');

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.BROWSER_BASE_URL + "/api/auth/google/callback",
  },
  function(accessToken, refreshToken, profile, cb) {
    let emails = profile.emails.map((email) => {
      if (email.verified) return email.value;
    });
    Usuario.findOne({ email: { $in: emails } }, async function(err, usuario) {
      if (err) return cb(err);
      if (!usuario) return cb(null, false);

      usuario.nome = profile.displayName;
      if (profile.photos) usuario.foto = profile.photos[0].value;

      await usuario.save();

      return cb(null, usuario);
    });
  }
));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, user);
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/admin', failureRedirect: '/', failureMessage: true }));

router.get('/auth/me', function(req, res) {
  return res.json(req.user || null);
});

router.get('/auth/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;
