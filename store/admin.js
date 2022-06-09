export const state = () => ({
  unidades: [],
  unidade: {},

  servicos: [],
  servico: {},
});

export const mutations = {
  setUnidades: (state, payload) => {
    state.unidades = payload;
  },
  setUnidade: (state, payload) => {
    state.unidade = payload;
  },
  removeUnidade: (state, payload) => {
    state.unidade = {};
    state.unidades = state.unidades.filter((value) => {
      return value._id !== payload._id;
    });
  },

  setServicos: (state, payload) => {
    state.servicos = payload;
  },
  setServico: (state, payload) => {
    state.servico = payload;
  },
};

export const actions = {
  async fetchUnidades(context) {
    return await this.$axios.get('/api/unidades')
    .then((response) => {
      context.commit('setUnidades', response.data);
    });
  },
  async saveUnidade(context) {
    return await this.$axios.post('/api/unidades', context.state.unidade)
    .then(() => {
      context.commit('setUnidade', {});
    });
  },
  async updateUnidade(context) {
    return await this.$axios.put('/api/unidades/' + context.state.unidade._id, context.state.unidade)
    .then(() => {
      context.commit('setUnidade', {});
    })
  },
  async deleteUnidade(context) {
    return await this.$axios.delete('/api/unidades/' + context.state.unidade._id)
    .then((response) => {
      context.commit('removeUnidade', response.data);
    });
  },

  async fetchServicos(context) {
    return await this.$axios.get('/api/servicos/?populate=unidade&populate_fields=nome')
    .then((response) => {
      context.commit('setServicos', response.data);
    });
  },
  async saveServico(context) {
    return await this.$axios.post('/api/servicos', context.state.servico)
    .then(() => {
      context.commit('setServico', {});
    });
  },
};
