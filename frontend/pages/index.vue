<template>
  <v-container>
    <ClientOnly>
      <v-row
        class="my-5"
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
                <v-icon size="x-large">
                  mdi-cash-marker
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
                <v-icon size="x-large">
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
        <v-skeleton-loader
          type="paragraph@2, actions"
          class="loader"
          max-width="80ch"
        />
      </template>
    </ClientOnly>
  </v-container>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify'
import { useMainStore } from '~/store'
import { useConfigStore } from '~/store/config'

useHeadSafe({
  title: 'PagIF',
})

const store = useMainStore()
const configStore = useConfigStore()

const { intro, darkMode } = storeToRefs(configStore)

const route = useRoute()
const router = useRouter()

onBeforeMount(() => {
  if (route.query.unidade) {
    const unidade = store.unidades.find(unidade => (unidade.slug && unidade.slug === route.query.unidade))
    if (unidade) {
      configStore.unidade = unidade
      useToast().success(`Unidade definida para "${unidade.nome}".`)
    }

    router.replace({ query: null })
  }
})

const { smAndDown } = useDisplay()

const css_intro_flex_direction = computed(() => {
  return smAndDown.value ? 'column' : 'row'
})
const css_intro_text_flex = computed(() => {
  return smAndDown.value ? 'auto' : '80ch'
})
</script>

<style lang="scss" scoped>
.intro {
  display: flex;
  flex-direction: v-bind(css_intro_flex_direction);
  flex-wrap: nowrap;
  align-items: stretch;
  justify-content: center;
  gap: 1rem;

  &__marca {
    flex: 0 1 160px;
  }

  &__text {
    flex: 0 1 v-bind(css_intro_text_flex);
  }
}

.loader {
  margin: 75px auto;
}
</style>
