import { useMainStore } from '.'
import { useFetch } from '#app'

export const useServicoStore = defineStore('servico', {
  state: () => ({
    _id: null,
    unidade: null,
    codigo: null,
    nome: '',
    desc: '',
    referencia_required: null,
    createdAt: null,
    updatedAt: null,
  }),

  actions: {
    async save() {
      let servico = {
        ...this.$state,
        unidade: (Object.prototype.hasOwnProperty.call(this.unidade, '_id')) ? this.unidade._id : this.unidade
      }
      const response = await useFetch('/api/servicos', { method: 'POST', body: servico })
      this.$reset()
      return response
    },
    async update() {
      let servico = {
        ...this.$state,
        unidade: (Object.prototype.hasOwnProperty.call(this.unidade, '_id')) ? this.unidade._id : this.unidade
      }
      const response = await useFetch(`/api/servicos/${this._id}`, { method: 'PUT', body: servico })
      this.$reset()
      return response
    },
    async delete() {
      const response = await useFetch(`/api/servicos/${this._id}`, { method: 'DELETE' })
      this.$reset()
      useMainStore().removeServico(response.data.value)
      return response
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useServicoStore, import.meta.hot))
}
