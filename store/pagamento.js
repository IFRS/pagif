const defaultState = {
  _id: null,
  idPagamento: null,
  unidade: null,
  nomeUnidade: null,
  nomeServico: null,
  codigoServico: null,
  referencia: null,
  competencia: null,
  vencimento: null,
  nomeContribuinte: null,
  cnpjCpf: null,
  valorPrincipal: null,
  valorDescontos: null,
  valorOutrasDeducoes: null,
  valorMulta: null,
  valorJuros: null,
  valorOutrosAcrescimos: null,
  dataCriacao: null,
  proximaUrl: null,
  situacao: {},
  tipoPagamentoEscolhido: null,
  valor: null,
  nomePSP: null,
  transacaoPSP: null,
};

export const state = () => defaultState;

export const getters = {
  id: state => state._id,
  idPagamento: state => state.idPagamento,
  unidade: state => state.unidade,
  nomeUnidade: state => state.nomeUnidade,
  nomeServico: state => state.nomeServico,
  codigoServico: state => state.codigoServico,
  referencia: state => state.referencia,
  competencia: state => state.competencia,
  vencimento: state => state.vencimento,
  nomeContribuinte: state => state.nomeContribuinte,
  cnpjCpf: state => state.cnpjCpf,
  valorPrincipal: state => state.valorPrincipal,
  valorDescontos: state => state.valorDescontos,
  valorOutrasDeducoes: state => state.valorOutrasDeducoes,
  valorMulta: state => state.valorMulta,
  valorJuros: state => state.valorJuros,
  valorOutrosAcrescimos: state => state.valorOutrosAcrescimos,
  dataCriacao: state => state.dataCriacao,
  proximaUrl: state => state.proximaUrl,
  situacao: state => state.situacao,
  tipoPagamentoEscolhido: state => state.tipoPagamentoEscolhido,
  valor: state => {
    if (!state.valor) {
      return state.valorPrincipal - state.valorDescontos - state.valorOutrasDeducoes + state.valorMulta + state.valorJuros + state.valorOutrosAcrescimos;
    }

    return state.valor;
  },
  nomePSP: state => state.nomePSP,
  transacaoPSP: state => state.transacaoPSP,
};

export const mutations = {
  id: (state, payload) => {
    state._id = payload;
  },
  idPagamento: (state, payload) => {
    state.idPagamento = payload;
  },
  unidade: (state, payload) => {
    state.unidade = payload;
  },
  nomeUnidade: (state, payload) => {
    state.nomeUnidade = payload;
  },
  nomeServico: (state, payload) => {
    state.nomeServico = payload;
  },
  codigoServico: (state, payload) => {
    state.codigoServico = payload;
  },
  referencia: (state, payload) => {
    state.referencia = payload;
  },
  competencia: (state, payload) => {
    state.competencia = payload;
  },
  vencimento: (state, payload) => {
    state.vencimento = payload;
  },
  nomeContribuinte: (state, payload) => {
    state.nomeContribuinte = payload;
  },
  cnpjCpf: (state, payload) => {
    state.cnpjCpf = payload;
  },
  valorPrincipal: (state, payload) => {
    state.valorPrincipal = payload;
  },
  valorDescontos: (state, payload) => {
    state.valorDescontos = payload;
  },
  valorOutrasDeducoes: (state, payload) => {
    state.valorOutrasDeducoes = payload;
  },
  valorMulta: (state, payload) => {
    state.valorMulta = payload;
  },
  valorJuros: (state, payload) => {
    state.valorJuros = payload;
  },
  valorOutrosAcrescimos: (state, payload) => {
    state.valorOutrosAcrescimos = payload;
  },
  dataCriacao: (state, payload) => {
    state.dataCriacao = payload;
  },
  proximaUrl: (state, payload) => {
    state.proximaUrl = payload;
  },
  situacao: (state, payload) => {
    state.situacao = payload;
  },
  tipoPagamentoEscolhido: (state, payload) => {
    state.tipoPagamentoEscolhido = payload;
  },
  valor: (state, payload) => {
    state.valor = payload;
  },
  nomePSP: (state, payload) => {
    state.nomePSP = payload;
  },
  transacaoPSP: (state, payload) => {
    state.transacaoPSP = payload;
  },
  clear: (state) => {
    Object.assign(state, defaultState);
  },
  replace: (state, payload) => {
    Object.assign(state, payload);
  },
};

export const actions = {
  async save_public(context, recaptcha) {
    return await this.$axios.post('/api/public/pagamentos', { ...context.state, recaptcha })
    .then((response) => {
      context.commit('replace', response.data);
    });
  },
  async save(context) {
    return await this.$axios.post('/api/pagamentos', context.state)
    .then((response) => {
      context.commit('replace', response.data);
    });
  },
  async update(context) {
    return await this.$axios.put('/api/pagamentos/' + context.state._id, context.state)
    .then(() => {
      context.commit('clear');
    });
  },
  async delete(context) {
    return await this.$axios.delete('/api/pagamentos/' + context.state._id)
    .then((response) => {
      context.commit('clear');
      context.commit('removePagamento', response.data, { root: true });
    });
  },
  async show_public(context, id) {
    return await this.$axios.get('/api/public/pagamentos/' + id)
    .then((response) => {
      context.commit('replace', response.data);
    });
  },
  async show(context, id) {
    return await this.$axios.get('/api/pagamentos/' + id)
    .then((response) => {
      context.commit('replace', response.data);
    });
  },
  async consulta(context, payload) {
    return await this.$axios.put('/api/pagamentos/update', {idPagamento: payload})
    .then((response) => {
      context.commit('updatePagamento', response.data, { root: true });
    });
  },
};
