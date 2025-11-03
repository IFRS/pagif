import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useConfigStore } from '~/stores/config'

export default defineNuxtRouteMiddleware((to) => {
  const store = useConfigStore()

  if (
    import.meta.client
      && to.name !== 'index'
      && to.name !== 'unidades'
      && to.name !== 'pagamento-id'
      && !to.name?.startsWith('admin')
      && !store.unidade
  ) {
    return navigateTo({ name: 'unidades', query: { returnPath: to.path } })
  }

  return
})
