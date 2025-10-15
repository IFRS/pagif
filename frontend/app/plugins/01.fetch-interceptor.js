import { defineNuxtPlugin, navigateTo } from '#app'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(({ $pinia }) => {
  const authStore = useAuthStore($pinia)

  globalThis.$fetch = globalThis.$fetch.create({
    onResponseError({ response }) {
      if (response.status == 401) {
        authStore.user = null
        return navigateTo('/', { replace: true })
      }
    },
  })
})
