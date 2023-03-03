export default (context) => {
  context.app.router.beforeEach((to, from, next) => {
    if (
      process.client
      && to.name !== 'index'
      && to.name !== 'unidades'
      && !to.name.startsWith('admin')
      && !context.store.getters['config/unidade']
    ) {
      next({ name: 'unidades' });
    } else {
      next();
    }
  });
}
