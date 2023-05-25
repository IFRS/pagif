import { defineNuxtPlugin, useCookie } from '#app'

export default defineNuxtPlugin(async ({ $configStore, $authStore, $toast }) => {
  if (process.server) {
    try {
      const data = await $fetch('/api/auth/me')
      if (data) $authStore.user = data;
    } catch (error) {
      console.error(error);
    }
  }

  if (process.client) {
    try {
      await $configStore.populateConfig();
    } catch (error) {
      $toast.error('Ocorreu um erro ao carregar as Configurações do Sistema: ' + error.message);
      console.error(error);
    }

    let cookie = useCookie('darkMode');

    const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches || cookie;
    if (darkMode) {
      $configStore.darkMode = darkMode;
    }

    const unidade_id = localStorage.getItem('unidade');
    if (unidade_id) {
      try {
        await $configStore.populateUnidade(unidade_id);
      } catch (error) {
        $toast.error('Ocorreu um erro ao carregar a Unidade previamente selecionada: ' + error.message);
        console.error(error);
      }
    }

    $configStore.$subscribe((mutation, state) => {
      cookie = state.darkMode;
      localStorage.setItem('unidade', state.unidade._id);
    }, { detached: true });
  }
})
