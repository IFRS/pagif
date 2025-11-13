export const useConfigStore = defineStore('config', {
  state: () => ({
    unidade: null,
    darkMode: false,
    dnt: false,
    sigla: null,
    orgao: null,
    intro: null,
    vencimento: 1,
  }),
  actions: {
    setEmptySettings() {
      this.sigla = ''
      this.orgao = ''
      this.intro = ''
      this.vencimento = 1
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useConfigStore, import.meta.hot))
}
