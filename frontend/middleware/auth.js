export default async function(context) {
  let usuario = null;

  if (process.server) {
    usuario = await context.app.$axios.$get('/api/auth/me');
  }

  if (process.client) {
    usuario = context.store.getters['auth/user'];
  }

  if (!usuario) {
    context.redirect('/');
  }
}
