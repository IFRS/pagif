<template>
  <v-app>
    <v-app-bar app fixed>
      <v-app-bar-title>IFpag</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-menu>
        <template v-slot:activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn
                color="secondary"
                v-bind="attrs"
                v-on="{ ...tooltip, ...menu }"
                :loading="$fetchState.pending || !$store.state.unidade"
              >
                {{ $store.getters['unidade/nome'] }}
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
              v-for="(unidade, index) in $store.getters['unidades']"
              :key="index"
            >
              <v-list-item-content>
                <v-list-item-title>{{ unidade.nome }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>
    <v-footer app fixed>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  async fetch() {
    await this.$store.dispatch('fetchUnidades')
    .catch((error) => {
      this.$toast.error('Ocorreu um erro ao carregar as Unidades: ' + error.message);
      console.log(error);
    });
  },
  computed: {
    selectedUnidade: {
      get() {
        return this.$store.state.unidades.findIndex((item) => {
          return item._id === this.$store.state.unidade._id;
        });
      },
      set(index) {
        this.$store.commit('unidade/replace', this.$store.state.unidades[index]);
        this.$router.push({
          name: 'pagamento',
        });
      }
    },
  },
}
</script>
