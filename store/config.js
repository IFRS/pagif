export const state = () => ({
  unidade: null,
  darkMode: false,
  dnt: false,
  sigla: null,
  orgao: null,
  intro: null,
});

export const getters = {
  unidade: state => state.unidade,
  darkMode: state => state.darkMode,
  dnt: state => state.dnt,
  sigla: state => state.sigla,
  orgao: state => state.orgao,
  intro: state => state.intro,
};

export const mutations = {
  unidade: (state, payload) => {
    state.unidade = payload;
  },
  darkMode: (state, payload) => {
    state.darkMode = payload;
  },
  dnt: (state, payload) => {
    state.dnt = payload;
  },
  sigla: (state, payload) => {
    state.sigla = payload;
  },
  orgao: (state, payload) => {
    state.orgao = payload;
  },
  intro: (state, payload) => {
    state.intro = payload;
  },
};

export const actions = {
  async populateUnidade(context, id) {
    return await this.$axios.get(`/api/public/unidades/${id}`)
    .then((response) => {
      context.commit('unidade', response.data);
    });
  },
  async populateConfig(context) {
    return await this.$axios.get(`/api/public/settings`)
    .then((response) => {
      context.commit('sigla', response.data.sigla);
      context.commit('orgao', response.data.orgao);
      context.commit('intro', response.data.intro);
    });
  },
};
