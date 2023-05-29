<template>
  <v-container>
    <v-row
      class="my-5"
      align="center"
    >
      <v-col>
        <client-only>
          <div class="intro">
            <v-img
              class="intro__marca"
              :src="(darkMode) ? '/img/logo-white.png' : '/img/logo.png'"
            />
            <div
              v-if="intro"
              class="intro__text"
              v-html="intro"
            />
          </div>
        </client-only>
      </v-col>
    </v-row>
    <v-row
      class="my-10"
      justify="center"
    >
      <v-col cols="auto">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            :color="isHovering ? 'accent' : ''"
            :to="{ name: 'consulta' }"
          >
            <v-card-text
              class="text-center"
              :class="isHovering ? 'white--text' : ''"
            >
              <v-icon
                size="x-large"
                :color="isHovering ? 'white' : ''"
              >
                mdi-archive-search-outline
              </v-icon>
              <v-card-title class="justify-center">
                Consultar Pagamento
              </v-card-title>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>

      <v-col cols="auto">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            :color="isHovering ? 'accent' : ''"
            :to="{ name: 'pagamento' }"
          >
            <v-card-text
              class="text-center"
              :class="isHovering ? 'white--text' : ''"
            >
              <v-icon
                size="x-large"
                :color="isHovering ? 'white' : ''"
              >
                mdi-cash-plus
              </v-icon>
              <v-card-title class="justify-center">
                Realizar Pagamento
              </v-card-title>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onBeforeMount } from 'vue';
import { useRoute, useRouter } from '#app';
import { storeToRefs } from 'pinia';
import { useDisplay } from 'vuetify';
import { useMainStore } from '~/store';
import { useConfigStore } from '~/store/config';

const store = useMainStore();
const configStore = useConfigStore();

const { intro, darkMode } = storeToRefs(configStore);

const route = useRoute();
const router = useRouter();

onBeforeMount(() => {
  if (route.query.unidade) {
    const unidade = store.unidades.find(unidade => (unidade.slug && unidade.slug === route.query.unidade));
    if (unidade) {
      configStore.unidade = unidade;
      useToast().success(`Unidade definida para "${unidade.nome}".`);
    }

    router.replace({ 'query': null });
  }
});

const { smAndDown } = useDisplay();
</script>

<style lang="scss" scoped>
.intro {
  display: flex;
  flex-direction: v-bind('smAndDown ? "column" : "row"');
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  &__marca {
    flex: 0 1 160px;
  }

  &__text {
    flex: 0 1 v-bind('smAndDown ? "auto" : "80ch"');
  }
}
</style>
