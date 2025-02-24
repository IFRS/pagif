import { createMongoAbility } from '@casl/ability';
import dayjs from 'dayjs';

export default function (restrictions) {
  return function (req, res, next) {
    if (req.session.user && dayjs(req.session.cookie.expires).isAfter(dayjs())) {
      if (req.session.user) {
        if (restrictions) {
          const ability = createMongoAbility(req.session.user.abilities);
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
