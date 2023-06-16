import { useNuxtApp } from '#app'
import { useAuthStore } from "~/store/auth"
import { createMongoAbility } from "@casl/ability"

export default function() {
  const { $pinia } = useNuxtApp()
  const authStore = useAuthStore($pinia)

  if (authStore.user) {
    const ability = createMongoAbility(authStore.user.abilities)
    return ability
  }
}
