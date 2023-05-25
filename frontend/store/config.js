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
      const data = await $fetch(`/api/public/unidades/${id}`);
      if (data) this.unidade = data;
    },
    async populateConfig() {
      const data = await $fetch('/api/public/settings');
      if (data) {
        this.sigla = data.sigla;
        this.orgao = data.orgao;
        this.intro = data.intro;
      }
    },
  },
})
