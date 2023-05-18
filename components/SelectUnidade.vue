<template>
  <v-menu offset-y>
    <template #activator="{ on: menu, attrs }">
      <v-tooltip location="left">
        <template #activator="{ on: tooltip }">
          <v-btn
            class="mr-3"
            color="primary"
            variant="text"
            :loading="$fetchState.pending"
            :disabled="!unidade"
            v-bind="attrs"
            v-on="{ ...tooltip, ...menu }"
          >
            {{ unidade?.nome || 'Selecione uma Unidade' }}
            <v-icon end>
              mdi-menu-down
            </v-icon>
          </v-btn>
        </template>
        <span>Trocar Unidade</span>
      </v-tooltip>
    </template>
    <v-list>
      <v-subheader>Unidade Gestora</v-subheader>
      <v-list-item-group
        v-model="selectedUnidade"
        mandatory
        color="primary"
      >
        <v-list-item
          v-for="(u, i) in $store.getters['unidades']"
          :key="i"
        >
          <v-list-item-content>
            <v-list-item-title>{{ u.nome }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'SelectUnidade',
  async fetch() {
    await this.$store.dispatch('fetchUnidades', true)
    .catch((error) => {
      this.$toast.error('Ocorreu um erro ao carregar a lista de Unidades: ' + error.message);
      console.error(error);
    });
  },
  computed: {
    selectedUnidade: {
      get() {
        return this.$store.state.unidades.findIndex((item) => {
          return item._id === this.$store.getters['config/unidade']?._id;
        });
      },
      set(index) {
        this.$nuxt.$loading.start();

        this.$store.commit('config/unidade', this.$store.state.unidades[index]);

        setTimeout(() => {
          this.$nuxt.$loading.finish();
          this.$router.push({ name: 'index' });
        }, 250);
      }
    },
    unidade: {
      ...mapGetters({ get: 'config/unidade' }),
      ...mapMutations({ set: 'config/unidade' }),
    },
  },
  unmounted() {
    this.$store.commit('clearUnidades');
  },
}
</script>
