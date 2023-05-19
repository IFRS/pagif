<template>
  <v-app dark>
    <v-container>
      <v-alert
        v-if="error.statusCode === 404"
        elevation="5"
        prominent
        type="error"
      >
        P&aacute;gina n&atilde;o encontrada!
      </v-alert>
      <v-alert
        v-else
        elevation="5"
        prominent
        type="warning"
      >
        Ocorreu um erro inesperado.
      </v-alert>
      <div>
        {{ props }}
      </div>
      <v-bnt @click="handleError">
        Ir para a P&aacute;gina Inicial
      </v-bnt>
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
  const handleError = () => clearError({ redirect: '/' })
</script>
