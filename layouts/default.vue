<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      mobile-breakpoint="0"
      width="300"
      app
      right
      temporary
    >
      <v-list nav two-line>
        <v-list-item>
          <SelectUnidade></SelectUnidade>
        </v-list-item>

        <v-list-item>
          <v-toolbar flat>
            <DarkMode></DarkMode>
            <Autenticacao></Autenticacao>
          </v-toolbar>
        </v-list-item>
      </v-list>

      <template #prepend>
        <v-list>
          <v-list-item>
            <v-btn
              icon
              @click="drawer = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
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

      <template v-if="$vuetify.breakpoint.smAndDown">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>
      <template v-else>
        <SelectUnidade></SelectUnidade>

        <DarkMode></DarkMode>

        <Autenticacao></Autenticacao>
      </template>
    </v-app-bar>
    <v-main>
      <slot />
      <Toast />
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
                <address v-if="unidade?.contato" class="contato" v-html="unidade.contato"></address>
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
  name: "DefaultLayout",
  middleware: "dark-mode",
  data() {
    return {
      loaded: false,
      drawer: false,
    }
  },
  computed: {
    sigla: {
      ...mapGetters({ get: "config/sigla" }),
      ...mapMutations({ set: "config/sigla" }),
    },
    orgao: {
      ...mapGetters({ get: "config/orgao" }),
      ...mapMutations({ set: "config/orgao" }),
    },
    unidade: {
      ...mapGetters({ get: "config/unidade" }),
      ...mapMutations({ set: "config/unidade" }),
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.loaded = true;
    });
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
  font-size: clampBuilder(400, 1200, 1, 1.5);
  font-weight: 400;
}

.contato::v-deep {
  a {
    color: inherit;
  }
}
</style>
