import dayjs from 'dayjs'
import { useMainStore } from '.'
import { useFetch } from '#app'

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
        return this.valorPrincipal - this.valorDescontos - this.valorOutrasDeducoes + this.valorMulta + this.valorJuros + this.valorOutrosAcrescimos;
      }

      return this.valor;
    },
  },

  actions: {
    async save_public(recaptcha) {
      this.vencimento = dayjs().add(1, 'day').format('YYYY-MM-DD');
      const response = await useFetch('/api/public/pagamentos', { method: 'POST', body: { ...this.$state, recaptcha } })
      if (response.data.value) this.$patch(response.data.value);
      return response;
    },
    async save() {
      const response = await useFetch('/api/pagamentos', { method: 'POST', body: { ...this.$state } })
      if (response.data.value) this.$patch(response.data.value);
      return response;
    },
    async update() {
      const response = await useFetch(`/api/pagamentos/${this._id}`, { method: 'PUT', body: { ...this.$state } })
      if (response.data.value) this.$reset();
      return response;
    },
    async delete() {
      const response = await useFetch(`/api/pagamentos/${this._id}`, { method: 'DELETE' })
      if (response.data.value) {
        this.$reset();
        useMainStore().removePagamento(response.data.value);
      }
      return response;
    },
    async show_public(id) {
      const response = await useFetch(`/api/public/pagamentos/${id}`)
      if (response.data.value) this.$patch(response.data.value);
      return response;
    },
    async show(id) {
      const response = await useFetch(`/api/pagamentos/${id}`)
      if (response.data.value) this.$patch(response.data.value);
      return response;
    },
    async consulta(id) {
      const response = await useFetch('/api/pagamentos/update', { method: 'PUT', body: { idPagamento: id } })
      if (response.data.value) useMainStore().updatePagamento(response.data.value);
      return response;
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePagamentoStore, import.meta.hot))
}
