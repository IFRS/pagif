import { defineStore } from 'pinia';

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
      return await this.$axios.get(isPublic ? '/api/public/unidades' : '/api/unidades')
      .then((response) => {
        this.unidades = response.data;
      });
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
      return await this.$axios.get(payload?.isPublic ? '/api/public/servicos' : '/api/servicos', { params: query })
      .then((response) => {
        this.servicos = response.data;
      });
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
      return await this.$axios.get('/api/pagamentos', { params: payload })
      .then((response) => {
        this.pagamentos = response.data;
      });
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
      return await this.$axios.get('/api/usuarios')
      .then((response) => {
        this.usuarios = response.data;
      });
    },

    /* Server Store Population */
    // TODO transformar em um plugin
    async nuxtServerInit({ commit }, { app, req }) {
      await app.$axios.get('/api/auth/me')
      .then(response => {
        commit('auth/user', response.data);
      });
      if (req.headers['dnt'] == 1) {
        commit('config/dnt', true);
      }
    },
  },
})
