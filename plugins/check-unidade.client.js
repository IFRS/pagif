export default (context) => {
  if (
    process.client
    && context.nuxtState.layout === 'default'
    && context.route.name !== 'unidades'
    && !context.store.getters['config/unidade']
  ) {
    window.onNuxtReady(() => { window.$nuxt.$router.push({ name: 'unidades' }) });
  }
}
