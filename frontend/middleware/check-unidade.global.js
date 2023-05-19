import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useConfigStore } from "~/store/config";

export default defineNuxtRouteMiddleware((to) => {
  const store = useConfigStore()
  if (
    process.client
    && to.name !== 'index'
    && to.name !== 'unidades'
    && to.name !== 'pagamento-id'
    && !to.name.startsWith('admin')
    && !store.unidade
  ) {
    return navigateTo({ name: 'unidades', query: { returnPath: to.path } })
  }
  return
})
