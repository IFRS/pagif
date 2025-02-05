import { defineNuxtRouteMiddleware, useNuxtApp, navigateTo } from '#app'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const { $pinia } = useNuxtApp()
  const authStore = useAuthStore($pinia)

  if (to.name.startsWith('admin') && !authStore.user) {
    return navigateTo('/')
  }

  return
})
