export const state = () => ({
  list: [],
  item: {},
})

export const mutations = {
  updateUnidades: (state, payload) => {
    state.list = payload;
  },
  updateUnidade: (state, payload) => {
    state.item = payload;
  },
  removeUnidade: (state, payload) => {
    state.item = {};
    state.list = state.list.filter((value) => {
      return value._id !== payload._id;
    });
  },
}

export const actions = {
  async save(context) {
    return await this.$axios.post('/api/unidades', context.state.item)
    .then((response) => {
      context.commit('updateUnidade', {});
    });
  },
  async update(context) {
    return await this.$axios.put('/api/unidades/' + context.state.item._id, context.state.item)
    .then((response) => {
      context.commit('updateUnidade', {});
    })
  },
  async delete(context) {
    return await this.$axios.delete('/api/unidades/' + context.state.item._id)
    .then((response) => {
      context.commit('removeUnidade', response.data);
    });
  },
}
