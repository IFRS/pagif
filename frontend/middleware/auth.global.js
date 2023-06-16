import { defineNuxtRouteMiddleware, useNuxtApp, navigateTo } from "#app"
import { useAuthStore } from "~/store/auth"

export default defineNuxtRouteMiddleware((to) => {
  const { $pinia } = useNuxtApp()
  const authStore = useAuthStore($pinia)

  if (to.meta.layout === 'admin' && !authStore.user) {
    return navigateTo('/')
  }

  return
})
