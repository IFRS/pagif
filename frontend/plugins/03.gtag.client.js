import { defineNuxtPlugin, useAppConfig } from '#app'
import { useConfigStore } from '../store/config'
import VueGtag from 'vue-gtag'

export default defineNuxtPlugin(async ({ $pinia, vueApp, router }) => {
  const config = useAppConfig()
  const store = useConfigStore($pinia)

  if (config.GA) {
    vueApp.use(VueGtag, {
      enabled: !store.dnt,
      config: {
        id: config.GA,
        params: {
          send_page_view: false
        }
      },
      appName: 'PagIF - Sistema de Pagamentos',
      pageTrackerScreenviewEnabled: true,
    }, router)
  }
})
