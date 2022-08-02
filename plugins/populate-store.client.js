export default async (context) => {
  if (process.client && context.nuxtState.layout === 'default') {
    let darkMode = context.$cookies.get('darkMode');
    if (darkMode) {
      context.store.commit('setDarkMode', darkMode);
    }

    await context.store.dispatch('initializeStore')
    .catch((error) => {
      context.$toast.error('Ocorreu um erro ao carregar dados locais: ' + error.message);
      console.log(error);
    });

    context.store.subscribe((mutation, state) => {
      if (mutation.type === 'setDarkMode') {
        context.$cookies.set('darkMode', state.darkMode);
      }
      if (mutation.type === 'unidade/replace') {
        localStorage.setItem('unidade', state.unidade._id);
      }
    });
  }
}
