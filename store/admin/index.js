export const state = () => ({
  unidades: [],
  servicos: [],
  pagamentos: [],
});

export const mutations = {
  setUnidades: (state, payload) => {
    state.unidades = payload;
  },
  removeUnidade: (state, payload) => {
    state.unidades = state.unidades.filter((value) => {
      return value._id !== payload._id;
    });
  },

  setServicos: (state, payload) => {
    state.servicos = payload;
  },
  removeServico: (state, payload) => {
    state.servicos = state.servicos.filter((value) => {
      return value._id !== payload._id;
    });
  },

  setPagamentos: (state, payload) => {
    state.pagamentos = payload;
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
};
