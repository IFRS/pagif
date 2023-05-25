import { defineNuxtPlugin } from '#app'
import { useMainStore } from '~/store'
import { useAuthStore } from '~/store/auth'
import { useConfigStore } from '~/store/config'
import { usePagamentoStore } from '~/store/pagamento'
import { useServicoStore } from '~/store/servico'
import { useSettingsStore } from '~/store/settings'
import { useSnackbarStore } from '~/store/snackbar'
import { useUnidadeStore } from '~/store/unidade'
import { useUsuarioStore } from '~/store/usuario'

export default defineNuxtPlugin(({ $pinia }) => {
  return {
    provide: {
      store: useMainStore($pinia),
      authStore: useAuthStore($pinia),
      configStore: useConfigStore($pinia),
      pagamentoStore: usePagamentoStore($pinia),
      servicoStore: useServicoStore($pinia),
      settingsStore: useSettingsStore($pinia),
      snackbarStore: useSnackbarStore($pinia),
      unidadeStore: useUnidadeStore($pinia),
      usuarioStore: useUsuarioStore($pinia),
    },
  }
})
