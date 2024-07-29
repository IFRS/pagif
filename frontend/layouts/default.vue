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
    <v-app-bar
      elevation="1"
      class="pe-lg-5"
    >
      <v-app-bar-title
        tag="h1"
        class="flex-0-1"
      >
        <NuxtLink
          :to="{ name: 'index' }"
          class="text-decoration-none text-primary d-flex flex-row flex-nowrap align-center"
        >
          <img
            v-if="mdAndUp"
            :src="(darkMode) ? '/img/logo-white.png' : '/img/logo.png'"
            class="govbr"
            aria-hidden="true"
          >
          <span class="titulo">
            Sistema de Pagamentos
            <template v-if="orgao && sigla">
              do <abbr :title="orgao">{{ sigla }}</abbr>
            </template>
            <template v-else-if="sigla">
              do {{ sigla }}
            </template>
          </span>
        </NuxtLink>
      </v-app-bar-title>

      <v-spacer />

      <template v-if="smAndDown">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      </template>
      <template v-else>
        <SelectUnidade />

        <v-divider
          v-if="mdAndUp"
          vertical
          class="mx-5"
        />

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
        <v-card-text>
          <v-row
            dense
            class="align-center"
          >
            <v-col v-if="unidade?.imagem">
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <a
                    :href="unidade?.link_url"
                    style="display: inline-block;"
                  >
                    <img
                      v-bind="props"
                      :src="unidade?.imagem"
                      class="marca-instituicao"
                    >
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
  </v-app>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify'
import { useConfigStore } from '~/store/config'

const configStore = useConfigStore()
const { sigla, orgao, unidade, darkMode } = storeToRefs(configStore)

const drawer = ref(false)

const { smAndDown, mdAndUp } = useDisplay()
</script>

<style lang="scss" scoped>
.govbr {
  margin-inline-start: 0.5rem;
  margin-inline-end: 0.5rem;
  max-height: 48px;
}

.separador {
  margin: 0 1rem;
}

.titulo {
  font-size: 1rem;
  font-size: clampBuilder(400, 1200, 1, 1.5);
  font-weight: 400;
}

.marca-instituicao {
  max-width: 320px;
}

.contato {
  :deep(a) {
    color: inherit;
  }
}
</style>
