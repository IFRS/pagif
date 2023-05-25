import { acceptHMRUpdate, defineStore } from 'pinia';

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
      this.unidades = [];
    },
    removeUnidade(payload) {
      this.unidades = this.unidades.filter((value) => {
        return value._id !== payload._id;
      });
    },
    async fetchUnidades(isPublic = false) {
      const data = await $fetch(isPublic ? '/api/public/unidades' : '/api/unidades');
      if (data) this.unidades = data;
    },

    /* Serviços */
    clearServicos() {
      this.servicos = [];
    },
    removeServico(payload) {
      this.servicos = this.servicos.filter((value) => {
        return value._id !== payload._id;
      });
    },
    async fetchServicos(payload) {
      const query = (payload?.unidade) ? { unidade: payload.unidade } : { populate: 'unidade', populate_fields: 'nome' };
      const data = $fetch(payload?.isPublic ? '/api/public/servicos' : '/api/servicos', { query: query });
      if (data) this.servicos = data;
    },

    /* Pagamentos */
    clearPagamentos() {
      this.pagamentos = [];
    },
    updatePagamento(payload) {
      this.pagamentos = this.pagamentos.map((pagamento) => {
        if (pagamento.idPagamento === payload.idPagamento) {
          return payload;
        } else {
          return pagamento;
        }
      });
    },
    removePagamento(payload) {
      this.pagamentos = this.pagamentos.filter((value) => {
        return value._id !== payload._id;
      });
    },
    async fetchPagamentos(payload) {
      const data = $fetch('/api/pagamentos', { query: payload })
      if (data) this.pagamentos = data;
    },

    /* Usuários */
    clearUsuarios() {
      this.usuarios = [];
    },
    removeUsuario(payload) {
      this.usuarios = this.usuarios.filter((value) => {
        return value._id !== payload._id;
      });
    },
    async fetchUsuarios() {
      const data = $fetch('/api/usuarios');
      if (data) this.usuarios = data;
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
}
