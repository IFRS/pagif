<template>
  <v-container>
    <ClientOnly>
      <v-row
        class="my-5"
        align="center"
      >
        <v-col>
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
      <template #fallback>
        <div
          class="d-flex justify-center align-center"
          style="height: 50dvh;"
        >
          <svg
            width="200"
            height="200"
            viewBox="0 0 38 38"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="a"
                x1="8.042%"
                y1="0%"
                x2="65.682%"
                y2="23.865%"
              >
                <stop
                  stop-color="#62C65E"
                  stop-opacity="0"
                  offset="0%"
                />
                <stop
                  stop-color="#62C65E"
                  stop-opacity=".631"
                  offset="63.146%"
                />
                <stop
                  stop-color="#62C65E"
                  offset="100%"
                />
              </linearGradient>
            </defs>
            <g
              fill="none"
              fill-rule="evenodd"
            >
              <g transform="translate(1 1)">
                <path
                  id="Oval-2"
                  d="M36 18c0-9.94-8.06-18-18-18"
                  stroke="url(#a)"
                  stroke-width="2"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 18 18"
                    to="360 18 18"
                    dur="0.9s"
                    repeatCount="indefinite"
                  />
                </path>
                <circle
                  fill="#5EB152"
                  cx="36"
                  cy="18"
                  r="1"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 18 18"
                    to="360 18 18"
                    dur="0.9s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            </g>
          </svg>
        </div>
      </template>
    </ClientOnly>
  </v-container>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useDisplay } from 'vuetify';
import { useMainStore } from '~/store';
import { useConfigStore } from '~/store/config';

definePageMeta({
  title: 'PagIF',
});

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
