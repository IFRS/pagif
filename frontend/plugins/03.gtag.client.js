import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { useConfigStore } from '../store/config'
import VueGtag from 'vue-gtag'

export default defineNuxtPlugin(async ({ $pinia, vueApp, router }) => {
  const config = useRuntimeConfig();
  const store = useConfigStore($pinia);

  if (config.public.GA) {
    vueApp.use(VueGtag, {
      enabled: !store.dnt,
      config: {
        id: config.public.GA,
        params: {
          send_page_view: false
        }
      },
      appName: 'PagIF - Sistema de Pagamentos',
      pageTrackerScreenviewEnabled: true,
    }, router);
  }
})
