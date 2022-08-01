export default async (context) => {
  if ( process.client && context.nuxtState.layout === 'default') {
    context.store.subscribe((mutation, state) => {
      if (mutation.type === 'unidade/replace') {
        localStorage.setItem('unidade', state.unidade._id);
      }
    });
    return await context.store.dispatch('initializeStore')
    .catch((error) => {
      context.$toast.error('Ocorreu um erro ao carregar dados locais: ' + error.message);
      console.log(error);
    });
  }
}
