import { defineNuxtPlugin, useCookie } from '#app'
// import { useConfigStore } from '~/store/config';

export default defineNuxtPlugin(async (nuxtApp) => {
  // const store = useConfigStore()
  await nuxtApp.$configStore.populateConfig()
  .catch((error) => {
    nuxtApp.$toast.error('Ocorreu um erro ao carregar as Configurações do Sistema: ' + error.message);
    console.error(error);
  });

  let cookie = useCookie('darkMode');

  const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches || cookie;
  if (darkMode) {
    nuxtApp.$configStore.darkMode = darkMode;
  }

  const unidade_id = localStorage.getItem('unidade');
  if (unidade_id) {
    await nuxtApp.$configStore.populateUnidade(unidade_id)
    .catch((error) => {
      nuxtApp.$toast.error('Ocorreu um erro ao carregar a Unidade previamente selecionada: ' + error.message);
      console.error(error);
    });
  }

  nuxtApp.$configStore.$subscribe((mutation, state) => {
    cookie = state.darkMode;
    localStorage.setItem('unidade', state.unidade._id);
  });
})
