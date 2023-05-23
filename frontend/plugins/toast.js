import { defineNuxtPlugin } from '#app'
import { useSnackbarStore } from '~/store/snackbar';

export default defineNuxtPlugin(() => {
  const store = useSnackbarStore();
  return {
    provide: {
      toast: {
        info (text) {
          store.show({ text, type: 'info' });
        },
        success (text) {
          store.show({ text, type: 'success' });
        },
        warning (text) {
          store.show({ text, type: 'warning' });
        },
        error (text) {
          store.show({ text, type: 'error' });
        }
      }
    }
  }
})
