import { useFetch } from '#app'
import { useMainStore } from '.'

export const useUnidadeStore = defineStore('unidade', {
  state: () => ({
    _id: null,
    nome: '',
    slug: '',
    token: '',
    imagem: null,
    link_url: '',
    link_titulo: '',
    contato: '',
    createdAt: null,
    updatedAt: null,
  }),

  actions: {
    async save() {
      const response = await useFetch('/api/unidades', { method: 'POST', body: { ...this.$state } })
      this.$reset()
      return response
    },
    async update() {
      const response = await useFetch(`/api/unidades/${this._id}`, { method: 'PUT', body: { ...this.$state } })
      this.$reset()
      return response
    },
    async delete() {
      const response = await useFetch(`/api/unidades/${this._id}`, { method: 'DELETE' })
      this.$reset()
      useMainStore().removeUnidade(response.data.value)
      return response
    },
    async fetchToken(payload) {
      const id = payload || this._id
      const response = await useFetch(`/api/unidades/token/${id}`)
      if (response.data.value) this.token = response.data.value
      return response
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUnidadeStore, import.meta.hot))
}
