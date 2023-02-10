export const state = () => ({
  unidade: null,
  darkMode: false,
  sigla: null,
  nome: null,
  intro: null,
  contato: null,
});

export const getters = {
  unidade: state => state.unidade,
  darkMode: state => state.darkMode,
  sigla: state => state.sigla,
  nome: state => state.nome,
  intro: state => state.intro,
  contato: state => state.contato,
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
  async populateConfig(context) {
    return await this.$axios.get(`/api/public/settings`)
    .then((response) => {
      context.state.sigla = response.data.sigla;
      context.state.nome = response.data.nome;
      context.state.intro = response.data.intro;
      context.state.contato = response.data.contato;
    });
  },
};
