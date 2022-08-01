export default (context) => {
  if (
    process.client
    && context.nuxtState.layout === 'default'
    && context.route.name !== 'index'
    && !context.store.getters['unidade/id']
  ) {
    window.onNuxtReady(() => { window.$nuxt.$router.push('/') })
  }
}
