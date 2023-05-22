import { defineNuxtPlugin } from '#app'
import { useConfigStore } from '~/store/config';

export default defineNuxtPlugin(async (nuxtApp) => {
  const store = useConfigStore()
  await store.populateConfig()
  .catch((error) => {
    nuxtApp.$toast.error('Ocorreu um erro ao carregar as Configurações do Sistema: ' + error.message);
    console.error(error);
  });

  const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches || nuxtApp.$cookies.get('darkMode');
  if (darkMode) {
    store.darkMode = darkMode;
  }

  const unidade_id = localStorage.getItem('unidade');
  if (unidade_id) {
    await store.populateUnidade(unidade_id)
    .catch((error) => {
      nuxtApp.$toast.error('Ocorreu um erro ao carregar a Unidade previamente selecionada: ' + error.message);
      console.error(error);
    });
  }

  store.$subscribe((mutation, state) => {
    nuxtApp.$cookies.set('darkMode', state.darkMode);
    localStorage.setItem('unidade', state.unidade._id);
  });
})
