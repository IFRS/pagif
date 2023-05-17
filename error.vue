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
      <NuxtLink to="/">
        Ir para a P&aacute;gina Inicial
      </NuxtLink>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  head() {
    const title = this.error.statusCode === 404 ? 'Página não encontrada!' : 'Erro';
    return title;
  },
}
</script>
