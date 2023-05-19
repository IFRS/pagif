import { useFetch } from 'nuxt/app';
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
      const response = await useFetch(isPublic ? '/api/public/unidades' : '/api/unidades');
      if (response.data) this.unidades = response.data;
      return response;
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
      const response = useFetch(payload?.isPublic ? '/api/public/servicos' : '/api/servicos', { params: query });
      if (response.data) this.servicos = response.data;
      return response;
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
      const response = useFetch('/api/pagamentos', { params: payload })
      if (response.data) this.pagamentos = response.data;
      return response;
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
      const response = useFetch('/api/usuarios');
      if (response.data) this.usuarios = response.data;
      return response;
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
