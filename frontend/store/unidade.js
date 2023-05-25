import { acceptHMRUpdate, defineStore } from 'pinia';
import { useMainStore } from '.';

export const useUnidadeStore = defineStore('unidade', {
  state: () => ({
    _id: null,
    nome: '',
    slug: '',
    token: '',
    imagem: null,
    link_url: '',
    link_titulo: '',
    contato: '',
    createdAt: null,
    updatedAt: null,
  }),

  actions: {
    async save() {
      return await this.$axios.post('/api/unidades', this.$state)
      .then(() => {
        this.$reset();
      });
    },
    async update() {
      return await this.$axios.put('/api/unidades/' + this._id, this.$state)
      .then(() => {
        this.$reset();
      });
    },
    async delete() {
      return await this.$axios.delete('/api/unidades/' + this._id)
      .then((response) => {
        this.$reset();
        useMainStore().removeUnidade(response.data);
      });
    },
    async fetchToken( payload) {
      const id = payload || this._id;
      return await this.$axios.get(`/api/unidades/token/${id}`).then((response) => {
        this.token = response.data;
      });
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUnidadeStore, import.meta.hot))
}
