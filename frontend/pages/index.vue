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
        <v-hover v-slot="{ hover }">
          <v-card
            :color="hover ? 'accent' : ''"
            :to="{ name: 'consulta' }"
          >
            <v-card-text
              class="text-center"
              :class="hover ? 'white--text' : ''"
            >
              <v-icon
                size="x-large"
                :color="hover ? 'white' : ''"
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
        <v-hover v-slot="{ hover }">
          <v-card
            :color="hover ? 'accent' : ''"
            :to="{ name: 'pagamento' }"
          >
            <v-card-text
              class="text-center"
              :class="hover ? 'white--text' : ''"
            >
              <v-icon
                size="x-large"
                :color="hover ? 'white' : ''"
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
import { useNuxtApp, useRoute, useRouter } from '#app';
import { storeToRefs } from 'pinia';
import { useDisplay } from 'vuetify';

const { $store, $configStore } = useNuxtApp();

const { intro, darkMode } = storeToRefs($configStore);

const route = useRoute();
const router = useRouter();
onBeforeMount(() => {
  if (route.query.unidade) {
      const unidade = $store.unidades.find(unidade => (unidade.slug && unidade.slug === route.query.unidade));
      if (unidade) {
        $configStore.unidade = unidade;
        this.$toast.success(`Unidade definida para "${unidade.nome}".`);
      }

      router.replace({ 'query': null });
    }
});

const { smAndDown } = useDisplay();
</script>

<style lang="scss" scoped>
.intro {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  // @media #{map-get($display-breakpoints, 'sm-and-down')} {
  //   flex-direction: column;
  // }

  @if (v-bind(smAndDown)) {
    flex-direction: column;
  }

  &__marca {
    flex: 0 1 160px;
  }

  &__text {
    flex: 0 1 80ch;

    // @media #{map-get($display-breakpoints, 'sm-and-down')} {
    //   flex-basis: auto;
    // }

    @if (v-bind(smAndDown)) {
      flex-basis: auto;
    }
  }
}
</style>
