const defaultState = {
  _id: null,
  unidade: null,
  codigo: null,
  nome: '',
  desc: '',
  vencimentoDias: null,
  valorPadrao: null,
  createdAt: null,
  updatedAt: null,
};

export const state = () => defaultState;

export const getters = {
  id: state => state._id,
  unidade: state => state.unidade,
  codigo: state => state.codigo,
  nome: state => state.nome,
  desc: state => state.desc,
  vencimentoDias: state => state.vencimentoDias,
  valorPadrao: state => state.valorPadrao,
  createdAt: state => state.createdAt,
  updatedAt: state => state.updatedAt,
};

export const mutations = {
  id: (state, payload) => {
    state._id = payload;
  },
  unidade: (state, payload) => {
    state.unidade = payload;
  },
  codigo: (state, payload) => {
    state.codigo = payload;
  },
  nome: (state, payload) => {
    state.nome = payload;
  },
  desc: (state, payload) => {
    state.desc = payload;
  },
  vencimentoDias: (state, payload) => {
    state.vencimentoDias = payload;
  },
  valorPadrao: (state, payload) => {
    state.valorPadrao = payload;
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
    let servico = {
      ...context.state,
      unidade: (context.state.unidade.hasOwnProperty('_id')) ? context.state.unidade._id : context.state.unidade
    };
    return await this.$axios.post('/api/servicos', servico)
    .then(() => {
      context.commit('clear');
    });
  },
  async update(context) {
    let servico = {
      ...context.state,
      unidade: (context.state.unidade.hasOwnProperty('_id')) ? context.state.unidade._id : context.state.unidade
    };
    return await this.$axios.put('/api/servicos/' + context.state._id, servico)
    .then(() => {
      context.commit('clear');
    });
  },
  async delete(context) {
    return await this.$axios.delete('/api/servicos/' + context.state._id)
    .then((response) => {
      context.commit('clear');
      context.commit('admin/removeServico', response.data, { root: true });
    });
  },
};
