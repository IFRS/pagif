import { defineNuxtPlugin, useRequestHeaders } from '#app'
import { useConfigStore } from '~/stores/config'

export default defineNuxtPlugin(async ({ $pinia }) => {
  const headers = useRequestHeaders()
  const configStore = useConfigStore($pinia)
  if (headers.dnt == '1') configStore.dnt = true
})
