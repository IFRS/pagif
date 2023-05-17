import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    sigla: '',
    orgao: '',
    intro: '',
  }),

  actions: {
    async show() {
      return await this.$axios.get('/api/settings')
      .then((response) => {
        this.$state = response.data;
      });
    },
    async save() {
      return await this.$axios.post('/api/settings', this.$state)
      .then((response) => {
        this.$state = response.data;
      });
    },
  },
})
