export const useSettingsStore = defineStore('settings', {
  state: () => ({
    sigla: '',
    orgao: '',
    intro: '',
  }),
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}
