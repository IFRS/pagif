export const useUsuarioStore = defineStore('usuario', {
  state: () => ({
    _id: null,
    email: '',
    nome: '',
    foto: '',
    abilities: [],
    createdAt: null,
    updatedAt: null,
  }),

  getters: {
    getAbilities: (state) => {
      return state.abilities.map((ability) => {
        return JSON.stringify(ability)
      })
    },
  },

  actions: {
    setAbilities(payload) {
      this.abilities = payload.map((ability) => {
        return JSON.parse(ability)
      })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsuarioStore, import.meta.hot))
}
