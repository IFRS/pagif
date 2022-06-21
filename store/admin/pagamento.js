const defaultState = {
  _id: null,
  codigoServico: null,
  referencia: null,
  competencia: null,
  vencimento: null,
  nomeContribuinte: '',
  cnpjCpf: null,
  valorPrincipal: null,
  valorDescontos: null,
  valorOutrasDeducoes: null,
  valorMulta: null,
  valorJuros: null,
  valorOutrosAcrescimos: null,
  createdAt: null,
  updatedAt: null,
};

export const state = () => defaultState;

export const getters = {
  id: state => state._id,
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
  createdAt: state => state.createdAt,
  updatedAt: state => state.updatedAt,
};

export const mutations = {
  id: (state, payload) => {
    state._id = payload;
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
};
