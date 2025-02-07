<template>
  <NuxtLayout :name="layout">
    <v-app dark>
      <v-container>
        <v-empty-state
          :headline="mensagens.headline"
          :title="mensagens.title"
          :text="mensagens.text"
          :image="mensagens.image"
          :action-text="mensagens.actionText"
          @click:action="handleError"
        />

        <DevOnly>
          <v-card
            v-if="error.message"
            density="comfortable"
            color="info"
            variant="tonal"
            title="Error Message"
            class="mb-5 mx-auto w-lg-50"
          >
            <v-card-text>
              <div v-html="error.message" />
            </v-card-text>
          </v-card>

          <v-card
            v-if="error.stack"
            density="comfortable"
            color="info"
            variant="tonal"
            title="Error Stack"
            class="mb-5 mx-auto w-lg-50"
          >
            <v-card-text>
              <pre v-html="error.stack" />
            </v-card-text>
          </v-card>
        </DevOnly>
      </v-container>
    </v-app>
  </NuxtLayout>
</template>

<script setup>
const props = defineProps({
  error: {
    type: Object,
    default: null,
  },
})

const route = useRoute()

const layout = computed(() => {
  return route.name?.startsWith('admin') ? 'admin' : 'default'
})

const mensagens = ref({
  headline: 'Erro',
  title: 'Ocorreu um erro inesperado.',
  text: 'Por favor, tente novamente mais tarde.',
  image: '/img/errors/error.png',
  actionText: 'Ir para a Página Inicial',
})

const authStore = useAuthStore()

watch(() => props.error, () => {
  if (props.error?.statusCode == 401) {
    authStore.$reset()
    clearError({ redirect: '/' })
  } else if (props.error?.statusCode == 404) {
    mensagens.value = {
      headline: 'Erro 404',
      title: 'Página não encontrada!',
      text: 'Por favor, verifique o endereço e tente novamente. Ou clique no botão abaixo para voltar para a página inicial.',
      image: '/img/errors/404.png',
      actionText: 'Ir para a Página Inicial',
    }
  }
}, { immediate: true })

const handleError = () => clearError({ redirect: '/' })
</script>
