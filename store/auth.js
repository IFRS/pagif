export const state = () => ({
  user: null,
});

export const getters = {
  user: state => state.user,
  userHasRole: (state) => (value) => {
    console.log(value);
    if (state.user.superadmin) return true;
    if (!state.user.roles || state.user.roles.length === 0) return false;
    return state.user.roles.some((role) => {
      return role.tipo === value;
    });
  },
};

export const mutations = {
  user: (state, payload) => {
    state.user = payload;
  },
};

export const actions = {};
