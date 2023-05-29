import { acceptHMRUpdate, defineStore } from 'pinia'
import { useFetch } from '#app'

export const useConfigStore = defineStore('config', {
  state: () => ({
    unidade: null,
    darkMode: false,
    dnt: false,
    sigla: null,
    orgao: null,
    intro: null,
  }),

  actions: {
    async populateUnidade(id) {
      const data = await useFetch(`/api/public/unidades/${id}`)
      if (data.value) this.unidade = data.value
    },
    async populateConfig() {
      const data = await useFetch('/api/public/settings')
      if (data.value) {
        this.sigla = data.value.sigla
        this.orgao = data.value.orgao
        this.intro = data.value.intro
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useConfigStore, import.meta.hot))
}
