export const state = () => ({
  show: false,
  text: '',
  color: '',
  icon: '',
});

export const mutations = {
  show: (state, payload) => {
    state.show = true;
    state.text = payload.text;
    switch (payload.type) {
      case 'info':
        state.color = 'info';
        state.icon = 'mdi-information';
        break;
      case 'success':
        state.color = 'success';
        state.icon = 'mdi-check';
        break;
      case 'warning':
        state.color = 'warning';
        state.icon = 'mdi-alert';
        break;
      case 'error':
        state.color = 'error';
        state.icon = 'mdi-close-circle';
        break;
      default:
        state.color = '';
        state.icon = '';
        break;
    };
  },
  updateShow: (state, payload) => {
    state.show = payload;
  }
};
