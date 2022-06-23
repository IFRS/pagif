export const state = () => ({
  unidades: [],
  pagamento: {},
});

export const mutations = {
  setUnidades: (state, payload) => {
    state.unidades = payload;
  },
  setPagamento: (state, payload) => {
    state.pagamento = payload;
  }
};

export const actions = {
  async fetchUnidades(context) {
    return await this.$axios.get('/api/unidades?fields=-token')
    .then((response) => {
      context.commit('setUnidades', response.data);
    });
  },

  async fetchPagamento(context, payload) {
    return await this.$axios.get('/api/pagamentos/' + payload)
    .then((response) => {
      context.commit('setPagamento', response.data);
    });
  },
};
