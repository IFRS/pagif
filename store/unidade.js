const defaultState = {
  _id: null,
  nome: '',
  slug: '',
  token: '',
  createdAt: null,
  updatedAt: null,
};

export const state = () => defaultState;

export const getters = {
  id: state => state._id,
  nome: state => state.nome,
  slug: state => state.slug,
  token: state => state.token,
  createdAt: state => state.createdAt,
  updatedAt: state => state.updatedAt,
};

export const mutations = {
  id: (state, paylod) => {
    state._id = paylod;
  },
  nome: (state, payload) => {
    state.nome = payload;
  },
  slug: (state, payload) => {
    state.slug = payload;
  },
  token: (state, payload) => {
    state.token = payload;
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
    return await this.$axios.post('/api/unidades', context.state)
    .then(() => {
      context.commit('clear');
    });
  },
  async update(context) {
    return await this.$axios.put('/api/unidades/' + context.state._id, context.state)
    .then(() => {
      context.commit('clear');
    });
  },
  async delete(context) {
    return await this.$axios.delete('/api/unidades/' + context.state._id)
    .then((response) => {
      context.commit('clear');
      context.commit('admin/removeUnidade', response.data, { root: true });
    });
  },
  async fetchToken(context, payload) {
    const id = payload || context.state._id;
    return await this.$axios.get(`/api/unidades/token/${id}`).then((response) => {
      context.commit('token', response.data);
    });
  },
};
