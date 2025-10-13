export const usePagamentoStore = defineStore('pagamento', {
  state: () => ({
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
    token: null,
  }),

  getters: {
    getValor() {
      if (!this.valor) {
        return this.valorPrincipal - this.valorDescontos - this.valorOutrasDeducoes + this.valorMulta + this.valorJuros + this.valorOutrosAcrescimos
      }

      return this.valor
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePagamentoStore, import.meta.hot))
}
