export const state = () => ({
  unidades: [],
});

export const mutations = {
  setUnidades: (state, payload) => {
    state.unidades = payload;
  },
};

export const actions = {
  async fetchUnidades(context) {
    return await this.$axios.get('/api/unidades?fields=-token')
    .then((response) => {
      context.commit('setUnidades', response.data);
    });
  },
};
