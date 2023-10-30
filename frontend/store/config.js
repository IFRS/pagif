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
      const response = await useFetch(`/api/public/unidades/${id}`)
      if (response.data.value) this.unidade = response.data.value
      return response
    },
    async populateConfig() {
      const response = await useFetch('/api/public/settings')
      if (response.data.value) {
        this.sigla = response.data.value.sigla
        this.orgao = response.data.value.orgao
        this.intro = response.data.value.intro
      }
      return response
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useConfigStore, import.meta.hot))
}
