export const state = () => ({
  unidades: [],
  unidade: {},
  pagamento: {},
});

export const getters = {
  unidade: state => state.unidade,
};

export const mutations = {
  setUnidades: (state, payload) => {
    state.unidades = payload;
  },
  setUnidade: (state, payload) => {
    state.unidade = payload;
  },
  setPagamento: (state, payload) => {
    state.pagamento = payload;
  },
};

export const actions = {
  initializeStore(context) {
    if (process.client && localStorage.getItem('unidade')) {
      context.commit('setUnidade', JSON.parse(localStorage.getItem('unidade')));
    }
  },

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
