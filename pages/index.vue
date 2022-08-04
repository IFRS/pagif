<template>
  <v-container>
    <h2 class="mb-5 text-center">Sistema de Pagamentos</h2>
    <v-row class="text-center">
      <v-col>
        <v-btn
          color="secondary"
          :to="{ name: 'consulta' }"
          x-large
        >
          Consultar Pagamento
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
        color="primary"
          :to="{ name: 'pagamento' }"
          x-large
        >
          Realizar Pagamento
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Index',
  beforeCreate() {
    if (this.$route.query.unidade) {
      const unidade = this.$store.getters['unidades'].find(unidade => (unidade.slug && unidade.slug === this.$route.query.unidade));
      if (unidade) {
        this.$store.commit('unidade/replace', unidade);
      }

      this.$router.replace({ 'query': null });
    }
  },
}
</script>
