import { useFetch } from '#app'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    sigla: '',
    orgao: '',
    intro: '',
  }),

  actions: {
    async show() {
      const response = await useFetch('/api/settings')
      if (response.data.valeu) this.$state = response.data.valeu
      return response
    },
    async save() {
      const response = await useFetch('/api/settings', { method: 'POST', body: this.$state })
      if (response.data.value) this.$state = response.data.value
      return response
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}
