import { useFetch } from 'nuxt/app';
import { defineStore } from 'pinia';

export const useConfigStore = defineStore('config', {
  state: () => ({
    unidade: null,
    darkMode: false,
    dnt: false,
    sigla: null,
    orgao: null,
    intro: null,
  }),

  actions: {
    async populateUnidade(id) {
      const response = await useFetch(`/api/public/unidades/${id}`);
      if (response.data) this.unidade = response.data;
      return response;
      // return await this.$axios.get(`/api/public/unidades/${id}`)
      // .then((response) => {
      //   this.unidade = response.data;
      // });
    },
    async populateConfig() {
      const response = await useFetch('/api/public/settings');
      if (response.data) {
        this.sigla = response.data.sigla;
        this.orgao = response.data.orgao;
        this.intro = response.data.intro;
      }
      return response;
      // return await this.$axios.get(`/api/public/settings`)
      // .then((response) => {
      //   this.sigla = response.data.sigla;
      //   this.orgao = response.data.orgao;
      //   this.intro = response.data.intro;
      // });
    },
  },
})
