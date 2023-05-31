import { defineNuxtPlugin, useCookie, useFetch } from '#app'
import useToast from '~/composables/useToast'
import { useAuthStore } from '~/store/auth'
import { useConfigStore } from '~/store/config'

export default defineNuxtPlugin(async ({ $pinia }) => {
  if (process.server) {
    const authStore = useAuthStore($pinia);
    const { data, error } = await useFetch('/api/auth/me')
    if (data.value) authStore.user = data.value;
    if (error.value) {
      console.error(error.value);
    }
  }

  if (process.client) {
    const configStore = useConfigStore($pinia);
    const { error } = await configStore.populateConfig();
    if (error.value) {
      useToast().error('Ocorreu um erro ao carregar as Configurações do Sistema.');
      console.error(error.value);
    }

    let cookie = useCookie('darkMode');

    const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches || cookie;
    if (darkMode) {
      configStore.darkMode = darkMode;
    }

    const unidade_id = localStorage.getItem('unidade');
    if (unidade_id) {
      const { error } = await configStore.populateUnidade(unidade_id);
      if (error.value) {
        useToast().error('Ocorreu um erro ao carregar a Unidade previamente selecionada.');
        console.error(error.value);
      }
    }

    configStore.$subscribe((mutation, state) => {
      cookie = state.darkMode;
      localStorage.setItem('unidade', state.unidade._id);
    }, { detached: true });
  }
})
