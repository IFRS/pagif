import { defineStore } from 'pinia';

export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    show: false,
    text: '',
    color: '',
    icon: '',
  }),

  actions: {
    show(payload) {
      this.show = true;
      this.text = payload.text;
      switch (payload.type) {
        case 'info':
          this.color = 'info';
          this.icon = 'mdi-information';
          break;
        case 'success':
          this.color = 'success';
          this.icon = 'mdi-check';
          break;
        case 'warning':
          this.color = 'warning';
          this.icon = 'mdi-alert';
          break;
        case 'error':
          this.color = 'error';
          this.icon = 'mdi-close-circle';
          break;
        default:
          this.color = '';
          this.icon = '';
          break;
      }
    },
    updateShow(payload) {
      this.show = payload;
    },
  },
})
