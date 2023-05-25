<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      mobile-breakpoint="0"
      width="300"
      location="right"
      temporary
    >
      <v-list
        nav
        lines="two"
      >
        <v-list-item>
          <SelectUnidade />
        </v-list-item>

        <v-list-item>
          <v-toolbar flat>
            <DarkMode />
            <Autenticacao />
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
    <v-app-bar elevation="1">
      <v-img
        :src="darkMode ? '/img/govbr-white.svg' : '/img/govbr.svg'"
        :max-width="120"
        aspect-ratio="4/1"
        class="d-none d-md-block govbr"
      />

      <v-divider
        vertical
        class="d-none d-md-block separador"
      />

      <NuxtLink
        :to="{ name: 'index' }"
        class="text-decoration-none"
        color="primary"
      >
        <client-only>
          <h1 class="titulo">
            Sistema de Pagamentos
            <template v-if="orgao && sigla">
              do <abbr :title="orgao">{{ sigla }}</abbr>
            </template>
            <template v-else-if="sigla">
              do {{ sigla }}
            </template>
          </h1>
        </client-only>
      </NuxtLink>

      <v-spacer />

      <template v-if="smAndDown">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      </template>
      <template v-else>
        <SelectUnidade />

        <DarkMode />

        <Autenticacao />
      </template>
    </v-app-bar>
    <v-main>
      <slot />
      <Toast />
    </v-main>
    <v-footer
      color="footer"
      class="mt-4"
    >
      <v-card
        flat
        rounded="0"
        color="footer"
        width="100%"
      >
        <client-only>
          <v-card-text>
            <v-row
              dense
              class="align-center"
            >
              <v-col v-if="unidade?.imagem">
                <v-tooltip location="top">
                  <template #activator="{ on, attrs }">
                    <a
                      :href="unidade?.link_url"
                      style="display: inline-block;"
                    >
                      <v-img
                        v-bind="attrs"
                        :src="unidade?.imagem"
                        :max-width="320"
                        v-on="on"
                      />
                    </a>
                  </template>
                  <span>{{ unidade?.link_titulo }}</span>
                </v-tooltip>
              </v-col>

              <v-col class="text-white text-right">
                <p>
                  <strong>{{ orgao }}</strong>
                  <template v-if="unidade?.nome">
                    <br>
                    {{ unidade.nome }}
                  </template>
                </p>
                <address
                  v-if="unidade?.contato"
                  class="contato"
                  v-html="unidade.contato"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </client-only>

        <v-divider dark />

        <v-card-text class="text-center text-body-2 text-grey-lighten-2">
          PagIF - Sistema de Pagamentos integrado ao <a
            href="https://www.gov.br/tesouronacional/pt-br/gru-e-pag-tesouro/pagtesouro"
            class="text-grey-lighten-2"
          >PagTesouro</a>
          &ensp;&verbar;&ensp;
          <a
            href="https://github.com/IFRS/pagif"
            class="text-grey-lighten-2"
          >C&oacute;digo-fonte</a>
          &ensp;&verbar;&ensp;
          <a
            href="https://ifrs.edu.br/"
            class="text-grey-lighten-2"
          >Desenvolvido por Instituto Federal do Rio Grande do Sul</a>
        </v-card-text>
      </v-card>
    </v-footer>
    <v-overlay :model-value="!loaded">
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-overlay>
  </v-app>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref, nextTick } from 'vue';
import { useDisplay } from 'vuetify';
import { useConfigStore } from '~/store/config';

const configStore = useConfigStore();
const { sigla, orgao, unidade, darkMode } = storeToRefs(configStore);

const loaded = ref(false);
const drawer = ref(false);

const { smAndDown } = useDisplay();

await nextTick(function () {
  loaded.value = true;
});
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

:deep(.contato) {
  a {
    color: inherit;
  }
}
</style>
