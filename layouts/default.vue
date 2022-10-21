<template>
  <v-app>
    <v-app-bar app fixed elevation="1">
      <v-img
        :src="darkMode ? '/img/govbr-white.svg' : '/img/govbr.svg'"
        :max-width="120"
        aspect-ratio="4/1"
        contain
        class="govbr"
      ></v-img>

      <v-divider
        vertical
        class="separador"
      ></v-divider>

        <nuxt-link
          :to="{ name: 'index' }"
          class="text-decoration-none"
          color="primary"
        >
          <h1 class="text-h5">Sistema de Pagamentos</h1>
        </nuxt-link>

      <v-spacer></v-spacer>

      <v-menu offset-y>
        <template #activator="{ on: menu, attrs }">
          <v-tooltip left>
            <template #activator="{ on: tooltip }">
              <v-btn
                class="mr-3"
                color="primary"
                text
                v-bind="attrs"
                v-on="{ ...tooltip, ...menu }"
                :loading="$fetchState.pending"
                :disabled="!$store.getters['config/unidade']"
              >
                {{ $store.getters['config/unidade']?.nome || 'Selecione uma Unidade' }}
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

      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on" style="width: min-content;">
            <v-switch
              v-model="darkMode"
              inset
              dense
              hide-details
              color="primary"
              prepend-icon="mdi-theme-light-dark"
            ></v-switch>
          </div>
        </template>
        <span>Modo Escuro</span>
      </v-tooltip>

      <!-- Login -->
      <v-btn
        color="primary"
        small
        style="text-transform: none;"
      >
        Entrar com&nbsp;<strong>gov.br</strong>
      </v-btn>

      <!-- Menu para usuários logados -->
      <!-- <v-menu
        offset-y
        :close-on-content-click="false"
      >
        <template #activator="{ on, attrs }">
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
            <v-list-item nuxt :to="{ name: 'admin' }">
              <v-list-item-content>
                <v-list-item-title>Administração</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider class="mb-2"></v-divider>

            <v-list-item nuxt :to="{ name: 'logout' }">
              <v-list-item-content>
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu> -->
    </v-app-bar>
    <v-main>
      <Nuxt />
      <Toast />
    </v-main>
    <v-footer app absolute padless color="footer">
      <v-card
        flat
        tile
        color="footer"
        width="100%"
      >
        <v-card-text>
          <v-row dense class="align-center">
            <v-col>
              <v-tooltip top>
                <template #activator="{ on, attrs }">
                  <a href="https://ifrs.edu.br/" style="display: inline-block;">
                    <v-img
                      v-bind="attrs"
                      v-on="on"
                      src="/img/ifrs.png"
                      :max-width="200"
                      contain
                      class="ifrs"
                    ></v-img>
                  </a>
                </template>
                <span>Portal do IFRS</span>
              </v-tooltip>
            </v-col>

            <v-col class="white--text text-right">
              <p><strong>Instituto Federal de Educação, Ciência e Tecnologia do Rio Grande do Sul</strong></p>
              <address>
                <p>
                  Rua General Osório, 348 - Bairro Centro
                  <br>
                  Bento Gonçalves - RS
                  <br>
                  CEP 95700-086
                </p>
              </address>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider dark></v-divider>

        <v-card-text class="text-center text-body-2 white--text">
          <a href="https://github.com/IFRS/" class="white--text">Código-fonte deste sistema</a>
          -
          <a href="https://ifrs.edu.br/" class="white--text">Desenvolvido pelo Instituto Federal do Rio Grande do Sul</a>
        </v-card-text>
      </v-card>
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
    setTimeout(() => {
      this.$vuetify.theme.dark = this.$store.getters['config/darkMode'];
    }, 0);
  },
}
</script>

<style lang="scss" scoped>
.govbr {
  flex: 0 0 200px;
}
.separador {
  margin: 0 1rem;
}
</style>
