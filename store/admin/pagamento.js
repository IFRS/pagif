export const state = () => ({
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
});

export const getters = {
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
};

export const mutations = {
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
};

export const actions = {
};
