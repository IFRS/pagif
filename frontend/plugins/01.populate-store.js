import { defineNuxtPlugin, useFetch, useCookie } from '#app'
import useToast from '~/composables/useToast'
import { useAuthStore } from '~/stores/auth'
import { useConfigStore } from '~/stores/config'

export default defineNuxtPlugin(async ({ $pinia }) => {
  if (import.meta.server) {
    const authStore = useAuthStore($pinia)
    const { data, error } = await useFetch('/api/auth/me')
    if (data.value) authStore.user = data.value
    if (error.value) {
      console.error(error.value)
    }
  }

  const configStore = useConfigStore($pinia)

  const cookie_darkmode = useCookie('darkMode')
  const cookie_unidade = useCookie('unidade')

  const { error } = await configStore.populateConfig()
  if (error.value && error.value.statusCode !== 404) {
    useToast().error('Ocorreu um erro ao carregar as Configurações do Sistema.')
    console.error(error.value)
  }

  const darkMode = cookie_darkmode.value
  if (darkMode) {
    configStore.darkMode = darkMode
  }

  /* Seta dark mode no cliente, caso o browser retorne que esse é o modo preferido do usuário */
  if (import.meta.client && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    configStore.darkMode = true
  }

  const unidade_id = cookie_unidade.value
  if (unidade_id) {
    const { error } = await configStore.populateUnidade(unidade_id)
    if (error.value) {
      useToast().error('Ocorreu um erro ao carregar a Unidade previamente selecionada.')
      console.error(error.value)
    }
  }

  configStore.$subscribe((mutation, state) => {
    cookie_darkmode.value = state.darkMode
    if (state.unidade?._id) cookie_unidade.value = state.unidade._id
  }, { detached: true })
})
