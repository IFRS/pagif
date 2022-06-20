export const state = () => ({
  unidades: [],
  unidade: {},

  servicos: [],
  servico: {},

  pagamentos: [],
  pagamento: {},
});

export const mutations = {
  setUnidades: (state, payload) => {
    state.unidades = payload;
  },
  setUnidade: (state, payload) => {
    state.unidade = payload;
  },
  removeUnidade: (state, payload) => {
    state.unidade = {};
    state.unidades = state.unidades.filter((value) => {
      return value._id !== payload._id;
    });
  },

  setServicos: (state, payload) => {
    state.servicos = payload;
  },
  setServico: (state, payload) => {
    state.servico = payload;
  },
  removeServico: (state, payload) => {
    state.servico = {};
    state.servicos = state.servicos.filter((value) => {
      return value._id !== payload._id;
    });
  },

  setPagamentos: (state, payload) => {
    state.pagamentos = payload;
  },
  setPagamento: (state, payload) => {
    state.pagamento = { ...state.pagamento, ...payload };
  },
  removePagamento: (state, payload) => {
    state.pagamento = {};
    state.pagamentos = state.pagamentos.filter((value) => {
      return value._id !== payload._id;
    });
  },
};

export const actions = {
  async fetchUnidades(context) {
    return await this.$axios.get('/api/unidades')
    .then((response) => {
      context.commit('setUnidades', response.data);
    });
  },
  async saveUnidade(context) {
    return await this.$axios.post('/api/unidades', context.state.unidade)
    .then(() => {
      context.commit('setUnidade', {});
    });
  },
  async updateUnidade(context) {
    return await this.$axios.put('/api/unidades/' + context.state.unidade._id, context.state.unidade)
    .then(() => {
      context.commit('setUnidade', {});
    })
  },
  async deleteUnidade(context) {
    return await this.$axios.delete('/api/unidades/' + context.state.unidade._id)
    .then((response) => {
      context.commit('removeUnidade', response.data);
    });
  },

  async fetchServicos(context, payload) {
    const query = (payload.unidade) ? '?unidade=' + payload.unidade : '?populate=unidade&populate_fields=nome';
    return await this.$axios.get('/api/servicos/' + query)
    .then((response) => {
      context.commit('setServicos', response.data);
    });
  },
  async saveServico(context) {
    let servico = {
      ...context.state.servico,
      unidade: (context.state.servico.unidade.hasOwnProperty('_id')) ? context.state.servico.unidade._id : context.state.servico.unidade
    };
    return await this.$axios.post('/api/servicos', servico)
    .then(() => {
      context.commit('setServico', {});
    });
  },
  async updateServico(context) {
    let servico = {
      ...context.state.servico,
      unidade: (context.state.servico.unidade.hasOwnProperty('_id')) ? context.state.servico.unidade._id : context.state.servico.unidade
    };
    return await this.$axios.put('/api/servicos/' + context.state.servico._id, servico)
    .then(() => {
      context.commit('setUnidade', {});
    })
  },
  async deleteServico(context) {
    return await this.$axios.delete('/api/servicos/' + context.state.servico._id)
    .then((response) => {
      context.commit('removeServico', response.data);
    });
  },
};
