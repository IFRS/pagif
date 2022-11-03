export const state = () => ({
  unidade: null,
  darkMode: false,
});

export const getters = {
  unidade: state => state.unidade,
  darkMode: state => state.darkMode,
};

export const mutations = {
  unidade: (state, payload) => {
    state.unidade = payload;
  },
  darkMode: (state, payload) => {
    state.darkMode = payload;
  },
};

export const actions = {
  async populateUnidade(context, id) {
    return await this.$axios.get(`/api/public/unidades/${id}`)
    .then((response) => {
      context.commit('unidade', response.data);
    });
  },
};
