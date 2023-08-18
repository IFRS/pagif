import { acceptHMRUpdate, defineStore } from 'pinia'
import { useFetch } from '#app'

export const useMainStore = defineStore('main', {
  state: () => ({
    unidades: null,
    servicos: null,
    pagamentos: null,
    usuarios: null,
  }),

  actions: {
    /* Unidades */
    clearUnidades() {
      this.unidades = []
    },
    removeUnidade(payload) {
      this.unidades = this.unidades.filter((value) => {
        return value._id !== payload._id
      })
    },
    async fetchUnidades(isPublic = false) {
      const response = await useFetch(isPublic ? '/api/public/unidades' : '/api/unidades')
      if (response.data.value) this.unidades = response.data.value
      return response
    },

    /* Serviços */
    clearServicos() {
      this.servicos = []
    },
    removeServico(payload) {
      this.servicos = this.servicos.filter((value) => {
        return value._id !== payload._id
      })
    },
    async fetchServicos(payload) {
      const query = (payload?.unidade) ? { unidade: payload.unidade } : { populate: 'unidade', populate_fields: 'nome' }
      const response = await useFetch(payload?.isPublic ? '/api/public/servicos' : '/api/servicos', { query: query })
      if (response.data.value) this.servicos = response.data.value
      return response
    },

    /* Pagamentos */
    clearPagamentos() {
      this.pagamentos = []
    },
    updatePagamento(payload) {
      this.pagamentos = this.pagamentos.map((pagamento) => {
        if (pagamento.idPagamento === payload.idPagamento) {
          return payload
        } else {
          return pagamento
        }
      })
    },
    removePagamento(payload) {
      this.pagamentos = this.pagamentos.filter((value) => {
        return value._id !== payload._id
      })
    },
    async fetchPagamentos(payload) {
      const response = await useFetch('/api/pagamentos', { query: payload })
      if (response.data.value) this.pagamentos = response.data.value
      return response
    },

    /* Usuários */
    clearUsuarios() {
      this.usuarios = []
    },
    removeUsuario(payload) {
      this.usuarios = this.usuarios.filter((value) => {
        return value._id !== payload._id
      })
    },
    async fetchUsuarios() {
      const response = await useFetch('/api/usuarios')
      if (response.data.value) this.usuarios = response.data.value
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
}
