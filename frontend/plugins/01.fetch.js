import { defineNuxtPlugin, navigateTo } from '#app'
import { ofetch } from "ofetch"
import { useAuthStore } from '~/store/auth'

export default defineNuxtPlugin(({ $pinia }) => {
  const authStore = useAuthStore($pinia)

  globalThis.$fetch = ofetch.create({
    onResponseError({ response }) {
      if (response.status == 401) {
        authStore.user = null
        return navigateTo('/', { replace: true })
      }
    },
  })
})
