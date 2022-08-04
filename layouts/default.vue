<template>
  <v-app>
    <v-app-bar app fixed>
      <v-app-bar-title>
        <nuxt-link
          :to="{name: 'index'}"
          class="text-decoration-none"
          color="primary"
        >
          IFpag
        </nuxt-link>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-menu
        offset-y
      >
        <template v-slot:activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn
                color="secondary"
                text
                v-bind="attrs"
                v-on="{ ...tooltip, ...menu }"
                :loading="$fetchState.pending"
              >
                {{ $store.getters['unidade/nome'] || 'Selecione uma Unidade' }}
                <v-icon right>
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

      <v-spacer></v-spacer>

      <v-switch
        class="me-5"
        v-model="darkMode"
        inset
        hide-details
      >
        <template v-slot:label>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
              >
                mdi-theme-light-dark
              </v-icon>
            </template>
            <span>Modo Escuro</span>
          </v-tooltip>
        </template>
      </v-switch>

      <v-avatar
        color="primary"
        size="42"
      >
        <v-icon dark>mdi-account-circle</v-icon>
      </v-avatar>
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>
    <v-footer app fixed>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'DefaultLayout',
  middleware: 'dark-mode',
  async fetch() {
    await this.$store.dispatch('fetchUnidades')
    .catch((error) => {
      this.$toast.error('Ocorreu um erro ao carregar a lista de Unidades: ' + error.message);
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
        this.$nuxt.$loading.start();

        this.$store.commit('unidade/replace', this.$store.state.unidades[index]);

        setTimeout(() => {
          this.$nuxt.$loading.finish();
          this.$router.push({ name: 'index' });
        }, 250);
      }
    },
    darkMode: {
      ...mapGetters({ get: 'darkMode' }),
      ...mapMutations({ set: 'setDarkMode' }),
    },
  },
  watch: {
    darkMode(newValue) {
      this.$vuetify.theme.dark = newValue;
    }
  },
  mounted() {
    this.$vuetify.theme.dark = this.$store.getters['darkMode'];
  },
}
</script>
