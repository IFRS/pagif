const defaultState = {
  sigla: '',
  nome: '',
  intro: '',
};

export const state = () => defaultState;

export const getters = {
  sigla: state => state.sigla,
  nome: state => state.nome,
  intro: state => state.intro,
};

export const mutations = {
  sigla (state, sigla) {
    state.sigla = sigla;
  },
  nome (state, nome) {
    state.nome = nome;
  },
  intro (state, intro) {
    state.intro = intro;
  },
  clear: (state) => {
    Object.assign(state, defaultState);
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
