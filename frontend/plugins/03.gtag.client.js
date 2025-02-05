import VueGtag from 'vue-gtag'
import { useConfigStore } from '../stores/config'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin(async ({ $pinia, vueApp, router }) => {
  const config = useRuntimeConfig()
  const store = useConfigStore($pinia)

  if (config.public.GA) {
    vueApp.use(VueGtag, {
      enabled: !store.dnt,
      config: {
        id: config.public.GA,
        params: {
          send_page_view: false,
        },
      },
      appName: 'PagIF - Sistema de Pagamentos',
      pageTrackerScreenviewEnabled: true,
    }, router)
  }
})
