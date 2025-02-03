import { createMongoAbility } from '@casl/ability'
import { useNuxtApp } from '#app'
import { useAuthStore } from '~/store/auth'

export default function () {
  const { $pinia } = useNuxtApp()
  const authStore = useAuthStore($pinia)

  if (authStore.user) {
    const ability = createMongoAbility(authStore.user.abilities)
    return ability
  }
}
