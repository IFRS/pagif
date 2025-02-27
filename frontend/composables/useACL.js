import { createMongoAbility } from '@casl/ability'
import { useNuxtApp } from '#app'
import { useAuthStore } from '~/stores/auth'

export default function () {
  const { $pinia } = useNuxtApp()
  const authStore = useAuthStore($pinia)

  const ability = createMongoAbility(authStore.user?.abilities)
  return ability
}
