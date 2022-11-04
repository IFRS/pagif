module.exports = function(roles, superadminOnly = false) {
  return function(req, res, next) {
    if (req.isAuthenticated()) {
      const { user } = req;

      if (!user) {
        res.status(401).end();
      } else if (user.superadmin) {
        next();
      } else if (superadminOnly) {
        res.status(403).end();
      } else if (!roles) {
        next();
      } else if (roles.length > 0) {
        const userHasRole = user.roles.some((role) => {
          return roles.includes(role.tipo);
        });
        if (userHasRole) next();
      } else {
        res.status(403).end();
      }
    } else {
      res.status(401).end();
    }
  };
};
