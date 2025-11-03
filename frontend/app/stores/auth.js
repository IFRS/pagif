export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
