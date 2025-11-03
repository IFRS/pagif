import { defineNuxtRouteMiddleware, useNuxtApp, navigateTo } from '#app'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const nuxtApp = useNuxtApp()
  const authStore = useAuthStore(nuxtApp.$pinia)

  if (to.name?.startsWith('admin') && !authStore.user) {
    return navigateTo('/')
  }

  return
})
