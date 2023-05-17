<template>
  <v-container>
    <PagamentoDetalhes :loading="$fetchState.pending">
      <v-btn
        color="primary"
        plain
        :to="{ name: 'consulta' }"
      >Voltar</v-btn>
    </PagamentoDetalhes>
  </v-container>
</template>

<script>
export default {
  name: 'ConsultaID',
  async fetch() {
    await this.$store.dispatch('pagamento/show_public', this.$route.params.id)
    .catch((error) => {
      this.$toast.error('Ocorreu um erro ao buscar o Pagamento. ' + error.message);
      this.$router.push({ name: 'consulta' });
    })
  },
  destroyed() {
    this.$store.commit('pagamento/clear');
  },
}
</script>
