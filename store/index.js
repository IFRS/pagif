export const state = () => ({
  unidades: [],
  servicos: [],
  pagamentos: [],
  usuarios: [],
});

export const getters = {
  unidades: state => state.unidades,
  servicos: state => state.servicos,
  pagamentos: state => state.pagamentos,
  usuarios: state => state.usuarios,

};

export const mutations = {
  /* Unidades */
  setUnidades: (state, payload) => {
    state.unidades = payload;
  },
  clearUnidades: (state) => {
    state.unidades = [];
  },
  removeUnidade: (state, payload) => {
    state.unidades = state.unidades.filter((value) => {
      return value._id !== payload._id;
    });
  },

  /* Serviços */
  setServicos: (state, payload) => {
    state.servicos = payload;
  },
  clearServicos: (state) => {
    state.servicos = [];
  },
  removeServico: (state, payload) => {
    state.servicos = state.servicos.filter((value) => {
      return value._id !== payload._id;
    });
  },

  /* Pagamentos */
  setPagamentos: (state, payload) => {
    state.pagamentos = payload;
  },
  clearPagamentos: (state) => {
    state.pagamentos = [];
  },
  updatePagamento: (state, payload) => {
    state.pagamentos = state.pagamentos.map((pagamento) => {
      if (pagamento.idPagamento === payload.idPagamento) {
        return payload;
      } else {
        return pagamento;
      }
    });
  },
  removePagamento: (state, payload) => {
    state.pagamentos = state.pagamentos.filter((value) => {
      return value._id !== payload._id;
    });
  },

  /* Usuários */
  setUsuarios: (state, payload) => {
    state.usuarios = payload;
  },
  clearUsuarios: (state) => {
    state.usuarios = [];
  },
  removeUsuario: (state, payload) => {
    state.usuarios = state.usuarios.filter((value) => {
      return value._id !== payload._id;
    });
  },
};

export const actions = {
  /* Unidades */
  async fetchUnidades(context, isPublic = false) {
    return await this.$axios.get(isPublic ? '/api/public/unidades' : '/api/unidades')
    .then((response) => {
      context.commit('setUnidades', response.data);
    });
  },

  /* Serviços */
  async fetchServicos(context, payload) {
    const query = (payload?.unidade) ? { unidade: payload.unidade } : { populate: 'unidade', populate_fields: 'nome' };
    return await this.$axios.get(payload?.isPublic ? '/api/public/servicos' : '/api/servicos', { params: query })
    .then((response) => {
      context.commit('setServicos', response.data);
    });
  },

  /* Pagamentos */
  async fetchPagamentos(context, payload) {
    return await this.$axios.get('/api/pagamentos', { params: payload })
    .then((response) => {
      context.commit('setPagamentos', response.data);
    });
  },

  /* Usuários */
  async fetchUsuarios(context) {
    return await this.$axios.get('/api/usuarios')
    .then((response) => {
      context.commit('setUsuarios', response.data);
    });
  },

  /* Server Store Population */
  async nuxtServerInit({ commit }, { app }) {
    await app.$axios.get('/api/auth/me')
    .then(response => {
      commit('auth/setUsuario', response.data);
    });
  },
};
