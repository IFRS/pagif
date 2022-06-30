export const state = () => ({
  unidades: [],
  servicos: [],
  pagamentos: [],
});

export const getters = {
  getPagamentos: state => state.pagamentos,
};

export const mutations = {
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
  async fetchUnidades(context) {
    return await this.$axios.get('/api/unidades')
    .then((response) => {
      context.commit('setUnidades', response.data);
    });
  },

  async fetchServicos(context, payload) {
    const query = (payload?.unidade) ? '?unidade=' + payload.unidade : '?populate=unidade&populate_fields=nome';
    return await this.$axios.get('/api/servicos/' + query)
    .then((response) => {
      context.commit('setServicos', response.data);
    });
  },

  async fetchPagamentos(context) {
    return await this.$axios.get('/api/pagamentos')
    .then((response) => {
      context.commit('setPagamentos', response.data);
    });
  },
  async consultaPagamento(context, payload) {
    return await this.$axios.put('/api/pagamentos/update', {idPagamento: payload})
    .then((response) => {
      context.commit('updatePagamento', response.data);
    });
  },
};
