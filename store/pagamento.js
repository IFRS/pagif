import { defineStore } from 'pinia';
import { useMainStore } from '.';
import dayjs from 'dayjs';

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
    valor() {
      if (!this.valor) {
        return this.valorPrincipal - this.valorDescontos - this.valorOutrasDeducoes + this.valorMulta + this.valorJuros + this.valorOutrosAcrescimos;
      }

      return this.valor;
    },
  },

  actions: {
    async save_public(recaptcha) {
      this.vencimento = dayjs().add(1, 'day').format('YYYY-MM-DD');
      return await this.$axios.post('/api/public/pagamentos', { ...this.$state, recaptcha })
      .then(function(response) {
        this.replace = response.data;
      });
    },
    async save() {
      return await this.$axios.post('/api/pagamentos', this.$state)
      .then((response) => {
        this.$state = response.data;
      });
    },
    async update() {
      return await this.$axios.put('/api/pagamentos/' + this._id, this.$state)
      .then(() => {
        this.$reset();
      });
    },
    async delete() {
      return await this.$axios.delete('/api/pagamentos/' + this._id)
      .then((response) => {
        this.$reset();
        useMainStore().removePagamento(response.data);
      });
    },
    async show_public(id) {
      return await this.$axios.get('/api/public/pagamentos/' + id)
      .then((response) => {
        this.$state = response.data;
      });
    },
    async show(id) {
      return await this.$axios.get('/api/pagamentos/' + id)
      .then((response) => {
        this.$state = response.data;
      });
    },
    async consulta(payload) {
      return await this.$axios.put('/api/pagamentos/update', {idPagamento: payload})
      .then((response) => {
        useMainStore().updatePagamento(response.data);
        return response.status;
      });
    },
  },
})
