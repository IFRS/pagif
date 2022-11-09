import { createMongoAbility } from "@casl/ability";

export default async ({ app, store }, inject) => {
  let user = null;

  if (process.server) {
    user = await app.$axios.$get('/api/auth/me');
  }

  if (process.client) {
    user = store.getters['auth/user'];
  }

  if (user) {
    const ability = createMongoAbility(user.abilities);
    inject('acl', ability);
  }
}
