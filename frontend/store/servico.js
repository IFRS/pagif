import { defineStore } from 'pinia';
import { useMainStore } from '.';

export const useServicoStore = defineStore('servico', {
  state: () => ({
    _id: null,
    unidade: null,
    codigo: null,
    nome: '',
    desc: '',
    createdAt: null,
    updatedAt: null,
  }),

  actions: {
    async save() {
      let servico = {
        ...this.$state,
        unidade: (Object.prototype.hasOwnProperty.call(this.unidade, '_id')) ? this.unidade._id : this.unidade
      };
      return await this.$axios.post('/api/servicos', servico)
      .then(() => {
        this.$reset();
      });
    },
    async update() {
      let servico = {
        ...this.$state,
        unidade: (Object.prototype.hasOwnProperty.call(this.unidade, '_id')) ? this.unidade._id : this.unidade
      };
      return await this.$axios.put('/api/servicos/' + this._id, servico)
      .then(() => {
        this.$reset();
      });
    },
    async delete() {
      return await this.$axios.delete('/api/servicos/' + this._id)
      .then((response) => {
        this.$reset();
        useMainStore().removeServico(response.data);
      });
    },
  },
})
