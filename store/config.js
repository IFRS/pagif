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
      return await this.$axios.get(`/api/public/unidades/${id}`)
      .then((response) => {
        this.unidade = response.data;
      });
    },
    async populateConfig() {
      return await this.$axios.get(`/api/public/settings`)
      .then((response) => {
        this.sigla = response.data.sigla;
        this.orgao = response.data.orgao;
        this.intro = response.data.intro;
      });
    },
  },
})
