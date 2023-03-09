<template>
  <v-app>
    <v-app-bar app elevation="1">
      <v-img
        :src="$store.getters['config/darkMode'] ? '/img/govbr-white.svg' : '/img/govbr.svg'"
        :max-width="120"
        aspect-ratio="4/1"
        contain
        class="d-none d-md-block govbr"
      ></v-img>

      <v-divider
        vertical
        class="d-none d-md-block separador"
      ></v-divider>

      <nuxt-link
        :to="{ name: 'index' }"
        class="text-decoration-none"
        color="primary"
      >
        <client-only>
          <h1 class="titulo">
            Sistema de Pagamentos
            <template v-if="orgao && sigla">do <abbr :title="orgao">{{ sigla }}</abbr></template>
            <template v-else-if="sigla">do {{ sigla }}</template>
          </h1>
        </client-only>
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
                :disabled="!unidade"
              >
                {{ unidade?.nome || 'Selecione uma Unidade' }}
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

      <DarkMode></DarkMode>

      <UserMenu v-if="$store.getters['auth/user']"></UserMenu>
      <v-btn
        v-else
        color="primary"
        small
        style="text-transform: none;"
        href="/api/auth/google"
      >
        Entrar com&nbsp;<strong>Google</strong>
      </v-btn>
    </v-app-bar>
    <v-main>
      <Nuxt></Nuxt>
      <Toast></Toast>
    </v-main>
    <v-footer color="footer" class="mt-4">
      <v-card
        flat
        tile
        color="footer"
        width="100%"
      >
        <client-only>
          <v-card-text>
            <v-row dense class="align-center">
              <v-col v-if="unidade?.imagem">
                <v-tooltip top>
                  <template #activator="{ on, attrs }">
                    <a :href="unidade?.link_url" style="display: inline-block;">
                      <v-img
                        v-bind="attrs"
                        v-on="on"
                        :src="unidade?.imagem"
                        :max-width="320"
                        contain
                      ></v-img>
                    </a>
                  </template>
                  <span>{{ unidade?.link_titulo }}</span>
                </v-tooltip>
              </v-col>

              <v-col class="white--text text-right">
                <p>
                  <strong>{{ orgao }}</strong>
                  <template v-if="unidade?.nome">
                    <br>
                    {{ unidade.nome }}
                  </template>
                </p>
                <address v-if="unidade?.contato" v-html="unidade.contato"></address>
              </v-col>
            </v-row>
          </v-card-text>
        </client-only>

        <v-divider dark></v-divider>

        <v-card-text class="text-center text-body-2 grey--text text--lighten-2">
          PagIF - Sistema de Pagamentos integrado ao <a href="https://www.gov.br/tesouronacional/pt-br/gru-e-pag-tesouro/pagtesouro" class="grey--text text--lighten-2">PagTesouro</a>
          &ensp;&verbar;&ensp;
          <a href="https://github.com/IFRS/pagif" class="grey--text text--lighten-2">C&oacute;digo-fonte</a>
          &ensp;&verbar;&ensp;
          <a href="https://ifrs.edu.br/" class="grey--text text--lighten-2">Desenvolvido por Instituto Federal do Rio Grande do Sul</a>
        </v-card-text>
      </v-card>
    </v-footer>
    <v-overlay :value="!loaded">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'DefaultLayout',
  middleware: 'dark-mode',
  async fetch() {
    await this.$store.dispatch('fetchUnidades', true)
    .catch((error) => {
      this.$toast.error('Ocorreu um erro ao carregar a lista de Unidades: ' + error.message);
      console.error(error);
    });
  },
  data() {
    return {
      loaded: false,
    }
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
    sigla: {
      ...mapGetters({ get: 'config/sigla' }),
      ...mapMutations({ set: 'config/sigla' }),
    },
    orgao: {
      ...mapGetters({ get: 'config/orgao' }),
      ...mapMutations({ set: 'config/orgao' }),
    },
    unidade: {
      ...mapGetters({ get: 'config/unidade' }),
      ...mapMutations({ set: 'config/unidade' }),
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.loaded = true;
    });
  },
  destroyed() {
    this.$store.commit('clearUnidades');
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

.titulo {
  font-size: 1rem;
  font-size: clampBuilder(600, 1200, 0.8, 1.5);
  font-weight: 400;
}
</style>
