export const state = () => ({
  unidade: null,
  darkMode: false,
  sigla: null,
  nome: null,
  intro: null,
});

export const getters = {
  unidade: state => state.unidade,
  darkMode: state => state.darkMode,
  sigla: state => state.sigla,
  nome: state => state.nome,
  intro: state => state.intro,
};

export const mutations = {
  unidade: (state, payload) => {
    state.unidade = payload;
  },
  darkMode: (state, payload) => {
    state.darkMode = payload;
  },
  sigla: (state, payload) => {
    state.sigla = payload;
  },
  nome: (state, payload) => {
    state.nome = payload;
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
      context.commit('nome', response.data.nome);
      context.commit('intro', response.data.intro);
    });
  },
};
