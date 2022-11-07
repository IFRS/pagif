const defaultState = {
  _id: null,
  email: '',
  nome: '',
  foto: '',
  abilities: [],
  createdAt: null,
  updatedAt: null,
};

export const state = () => defaultState;

export const getters = {
  id: state => state._id,
  email: state => state.email,
  nome: state => state.nome,
  foto: state => state.foto,
  abilities: state => state.abilities,
  createdAt: state => state.createdAt,
  updatedAt: state => state.updatedAt,
};

export const mutations = {
  id: (state, payload) => {
    state._id = payload;
  },
  email: (state, payload) => {
    state.email = payload;
  },
  nome: (state, payload) => {
    state.nome = payload;
  },
  foto: (state, payload) => {
    state.foto = payload;
  },
  abilities: (state, payload) => {
    state.abilities = payload;
  },
  createdAt: (state, payload) => {
    state.createdAt = payload;
  },
  updatedAt: (state, payload) => {
    state.updatedAt = payload;
  },
  clear: (state) => {
    Object.assign(state, defaultState);
  },
  replace: (state, payload) => {
    Object.assign(state, payload);
  },
};

export const actions = {
  async save(context) {
    return await this.$axios.post('/api/usuarios', context.state)
    .then(() => {
      context.commit('clear');
    });
  },
  async update(context) {
    return await this.$axios.put('/api/usuarios/' + context.state._id, context.state)
    .then(() => {
      context.commit('clear');
    });
  },
  async delete(context) {
    return await this.$axios.delete('/api/usuarios/' + context.state._id)
    .then((response) => {
      context.commit('clear');
      context.commit('removeUsuario', response.data, { root: true });
    });
  },
};
