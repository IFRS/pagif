export const state = () => ({
  unidades: [],
  servicos: [],
  pagamentos: [],
});

export const getters = {
  unidades: state => state.unidades,
  servicos: state => state.servicos,
  pagamentos: state => state.pagamentos,
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
};

export const actions = {
  async initializeStore(context) {
    if (process.client && localStorage.getItem('unidade')) {
      let unidade_id = localStorage.getItem('unidade');

      return await this.$axios.get(`/api/unidades/${unidade_id}`)
      .then((response) => {
        context.commit('unidade/replace', response.data);
      });
    }
  },

  /* Unidades */
  async fetchUnidades(context) {
    return await this.$axios.get('/api/unidades')
    .then((response) => {
      context.commit('setUnidades', response.data);
    });
  },

  /* Serviços */
  async fetchServicos(context, payload) {
    const query = (payload?.unidade) ? '?unidade=' + payload.unidade : '?populate=unidade&populate_fields=nome';
    return await this.$axios.get('/api/servicos/' + query)
    .then((response) => {
      context.commit('setServicos', response.data);
    });
  },

  /* Pagamentos */
  async fetchPagamentos(context) {
    return await this.$axios.get('/api/pagamentos')
    .then((response) => {
      context.commit('setPagamentos', response.data);
    });
  },
};
