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
  async initializeStore(context) {
    if (process.client && localStorage.getItem('unidade')) {
      let unidade_id = localStorage.getItem('unidade');

      return await this.$axios.get(`/api/unidades/${unidade_id}/?fields=-token`)
      .then((response) => {
        context.commit('setUnidade', response.data);
      });
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
