module.exports = function(roles) {
  return function(req, res, next) {
    if (req.isAuthenticated()) {
      const { user } = req;

      if (!user) {
        res.status(401).end();
      } else if (user.superadmin) {
        next();
      } else if (!roles) {
        next();
      } else if (roles.size > 0) {
        roles.forEach(role => {
          if (user.roles.has(role)) next();
        });
      } else {
        res.status(403).end();
      }
    } else {
      res.status(401).end();
    }
  };
};
