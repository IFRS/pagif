import { acceptHMRUpdate, defineStore } from 'pinia'
import { useMainStore } from '.'
import { useFetch } from '#app'

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
    getAbilities: state => {
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
    async save() {
      const response = await useFetch('/api/usuarios', { method: 'POST', body: this.$state })
      this.$reset()
      return response
    },
    async update() {
      const response = await useFetch(`/api/usuarios/${this._id}`, { method: 'PUT', body: this.$state })
      this.$reset()
      return response
    },
    async delete() {
      const response = await useFetch(`/api/usuarios/${this._id}`, { method: 'DELETE' })
      this.$reset()
      useMainStore().removeUsuario(response.data.value)
      return response
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsuarioStore, import.meta.hot))
}
