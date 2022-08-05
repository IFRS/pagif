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

      <v-menu offset-y>
        <template v-slot:activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-badge
                :value="!$store.getters['config/unidade']"
                color="red"
                dot
                left
                overlap
              >
                <v-btn
                  class="mr-3"
                  color="secondary"
                  text
                  v-bind="attrs"
                  v-on="{ ...tooltip, ...menu }"
                  :loading="$fetchState.pending"
                >
                  {{ $store.getters['config/unidade']?.nome || 'Selecione uma Unidade' }}
                  <v-icon right>
                    mdi-menu-down
                  </v-icon>
                </v-btn>
              </v-badge>
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

      <v-menu
        offset-y
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="mr-3"
            dark
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-avatar
              dark
              color="primary"
              size="38"
            >
              <v-icon dark>mdi-account-circle</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-action>
                <v-switch
                  v-model="darkMode"
                  inset
                  hide-details
                  label="Modo Escuro"
                >
                </v-switch>
              </v-list-item-action>
            </v-list-item>

            <v-divider class="mb-2"></v-divider>

            <v-list-item nuxt :to="{ name: 'login' }">
              <v-list-item-content>
                <v-list-item-title>Login</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
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
    darkMode: {
      ...mapGetters({ get: 'config/darkMode' }),
      ...mapMutations({ set: 'config/darkMode' }),
    },
  },
  watch: {
    darkMode(newValue) {
      this.$vuetify.theme.dark = newValue;
    }
  },
  mounted() {
    this.$vuetify.theme.dark = this.$store.getters['config/darkMode'];
  },
}
</script>
