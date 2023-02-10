const defaultState = {
  sigla: '',
  nome: '',
  intro: '',
  contato: '',
};

export const state = () => defaultState;

export const getters = {
  sigla: state => state.sigla,
  nome: state => state.nome,
  intro: state => state.intro,
  contato: state => state.contato,
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
  contato (state, contato) {
    state.contato = contato;
  },
  clear: (state) => {
    Object.assign(state, defaultState);
  },
};

export const actions = {
  async save(context) {
    return await this.$axios.post('/api/settings', context.state)
    .then(() => {
      context.commit('clear');
    });
  },
};
