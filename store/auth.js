export const state = () => ({
  user: null,
});

export const getters = {
  user: state => state.user,
};

export const mutations = {
  user: (state, payload) => {
    state.user = payload;
  },
  clear: (state) => {
    state.user = null;
  },
};

export const actions = {};
