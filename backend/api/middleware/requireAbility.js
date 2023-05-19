const { createMongoAbility } = require('@casl/ability');

module.exports = function(restrictions) {
  return function(req, res, next) {
    if (req.isAuthenticated()) {
      const { user } = req;

      if (user) {
        if (restrictions) {
          const ability = createMongoAbility(user.abilities);
          if (ability.can(...restrictions)) {
            next();
          } else {
            res.status(403).end();
          }
        } else {
          next();
        }
      } else {
        res.status(401).end();
      }
    } else {
      res.status(401).end();
    }
  };
};
