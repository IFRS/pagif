<template>
  <v-app dark>
    <v-container>
      <v-alert
        v-if="error.statusCode === 404"
        elevation="5"
        prominent
        type="warning"
        class="mb-5"
      >
        P&aacute;gina n&atilde;o encontrada!
      </v-alert>

      <v-alert
        v-else
        elevation="5"
        prominent
        type="error"
        class="mb-5"
      >
        Ocorreu um erro inesperado.
      </v-alert>

      <div
        class="mb-5"
        v-html="error.message"
      />

      <div
        class="mb-5"
        v-html="error.stack"
      />

      <v-btn @click="handleError">
        Ir para a P&aacute;gina Inicial
      </v-btn>
    </v-container>
  </v-app>
</template>

<script setup>
const props = defineProps({
  error: {
    type: Object,
    default: null,
  },
})

const authStore = useAuthStore()

if (props.error?.statusCode == 401) {
  authStore.$reset()
  clearError({ redirect: '/' })
}

const handleError = () => clearError({ redirect: '/' })
</script>
