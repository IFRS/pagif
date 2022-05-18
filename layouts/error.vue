<template>
  <v-app dark>
    <v-alert
      v-if="error.statusCode === 404"
      color="red"
      elevation="5"
      prominent
      type="error"
    >
      {{ pageNotFound }}
    </v-alert>
    <v-alert
      v-else
      color="orange"
      elevation="5"
      prominent
      type="warning"
    >
      {{ otherError }}
    </v-alert>
    <NuxtLink to="/">
      In&iacute;cio
    </NuxtLink>
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
  data () {
    return {
      pageNotFound: 'Ops. Página não encontrada!',
      otherError: 'Ocorreu um erro inesperado.',
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title
    }
  },
}
</script>
