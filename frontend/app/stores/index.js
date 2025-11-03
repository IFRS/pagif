export const useMainStore = defineStore('main', {
  state: () => ({
    unidades: [],
    servicos: [],
    pagamentos: [],
    usuarios: [],
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

    /* Serviços */
    clearServicos() {
      this.servicos = []
    },
    removeServico(payload) {
      this.servicos = this.servicos.filter((value) => {
        return value._id !== payload._id
      })
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

    /* Usuários */
    clearUsuarios() {
      this.usuarios = []
    },
    removeUsuario(payload) {
      this.usuarios = this.usuarios.filter((value) => {
        return value._id !== payload._id
      })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
}
