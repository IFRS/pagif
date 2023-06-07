import { defineNuxtRouteMiddleware, navigateTo } from "#app"
import { useAuthStore } from "~/store/auth"

export default defineNuxtRouteMiddleware(({ $pinia }) => {
  const authStore = useAuthStore($pinia)

  if (!authStore.user) {
    return navigateTo('/')
  }

  return
})
