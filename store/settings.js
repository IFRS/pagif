const defaultState = () => ({
  sigla: '',
  orgao: '',
  intro: '',
});

export const state = () => defaultState();

export const getters = {
  sigla: state => state.sigla,
  orgao: state => state.orgao,
  intro: state => state.intro,
};

export const mutations = {
  sigla (state, sigla) {
    state.sigla = sigla;
  },
  orgao (state, orgao) {
    state.orgao = orgao;
  },
  intro (state, intro) {
    state.intro = intro;
  },
  clear: (state) => {
    Object.assign(state, defaultState());
  },
  replace: (state, payload) => {
    Object.assign(state, payload);
  },
};

export const actions = {
  async show(context) {
    return await this.$axios.get('/api/settings')
    .then((response) => {
      context.commit('replace', response.data);
    });
  },
  async save(context) {
    return await this.$axios.post('/api/settings', context.state)
    .then((response) => {
      context.commit('replace', response.data);
    });
  },
};
