import { defineStore } from 'pinia';
import { useMainStore } from '.';

export const useUsuarioStore = defineStore('usuario', {
  state: () => ({
    _id: null,
    email: '',
    nome: '',
    foto: '',
    abilities: [],
    createdAt: null,
    updatedAt: null,
  }),

  getters: {
    getAbilities: state => {
      return state.abilities.map((ability) => {
        return JSON.stringify(ability);
      });
    },
  },

  actions: {
    setAbilities(payload) {
      this.abilities = payload.map((ability) => {
        return JSON.parse(ability);
      });
    },
    async save() {
      return await this.$axios.post('/api/usuarios', this.$state)
      .then(() => {
        this.$reset();
      });
    },
    async update() {
      return await this.$axios.put('/api/usuarios/' + this._id, this.$state)
      .then(() => {
        this.$reset();
      });
    },
    async delete() {
      return await this.$axios.delete('/api/usuarios/' + this._id)
      .then((response) => {
        this.$reset();
        useMainStore().removeUsuario(response.data);
      });
    },
  },
})
