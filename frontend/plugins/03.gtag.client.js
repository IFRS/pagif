import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { useConfigStore } from '../store/config'
import VueGtag from 'vue-gtag'

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();
  const store = useConfigStore(nuxtApp.$pinia);

  if (config.GA) {
    nuxtApp.vueApp.use(VueGtag, {
      enabled: !store.dnt,
      config: {
        id: config.GA,
        params: {
          send_page_view: false
        }
      },
      appName: 'PagIF - Sistema de Pagamentos',
      pageTrackerScreenviewEnabled: true,
    }, nuxtApp.router);
  }
})
