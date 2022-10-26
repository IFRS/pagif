export default async (context) => {
  if (process.client) {
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches || context.$cookies.get('darkMode');
    if (darkMode) {
      context.store.commit('config/darkMode', darkMode);
    }

    const unidade_id = localStorage.getItem('unidade');
    if (unidade_id) {
      await context.store.dispatch('config/populateUnidade', unidade_id)
      .catch((error) => {
        context.$toast.error('Ocorreu um erro ao carregar a Unidade previamente selecionada: ' + error.message);
        console.error(error);
      });
    }

    context.store.subscribe((mutation, state) => {
      if (mutation.type === 'config/darkMode') {
        context.$cookies.set('darkMode', state.config.darkMode);
      }
      if (mutation.type === 'config/unidade') {
        localStorage.setItem('unidade', state.config.unidade._id);
      }
    });
  }
}
