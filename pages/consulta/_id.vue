<template>
  <v-container>
    <pagamento-detalhes>
      <v-btn
        color="primary"
        plain
        :to="{ name: 'consulta' }"
      >Voltar</v-btn>
    </pagamento-detalhes>
  </v-container>
</template>

<script>
export default {
  name: 'ConsultaID',
  async fetch() {
    await this.$store.dispatch('pagamento/show', this.$route.params.id)
    .catch((error) => {
      this.$toast.error('Ocorreu um erro ao buscar o Pagamento. ' + error.message);
      console.error(error);
    })
  },
  destroyed() {
    this.$store.commit('pagamento/clear');
  },
}
</script>
