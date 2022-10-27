export const state = () => ({
  usuario: null,
});

export const getters = {
  usuario: state => state.usuario,
};

export const mutations = {
  setUsuario: (state, payload) => {
    state.usuario = payload;
  }
};

export const actions = {
};
