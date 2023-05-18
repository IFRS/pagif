export default ({ store }, inject) => {
  inject('toast', {
    info (text) {
      store.commit('snackbar/show', { text, type: 'info' });
    },
    success (text) {
      store.commit('snackbar/show', { text, type: 'success' });
    },
    warning (text) {
      store.commit('snackbar/show', { text, type: 'warning' });
    },
    error (text) {
      store.commit('snackbar/show', { text, type: 'error' });
    }
  });
};
