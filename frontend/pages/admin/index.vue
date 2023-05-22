<template>
  <v-container>
    <PageTitle>Administração</PageTitle>
    <v-row justify="center">
      <v-col
        v-if="numUnidades"
        cols="12"
        md="3"
      >
        <AdminInfoCount
          :num="numUnidades"
          icon="mdi-office-building-marker"
        >
          Unidades
        </AdminInfoCount>
      </v-col>
      <v-col
        v-if="numServicos"
        cols="12"
        md="3"
      >
        <AdminInfoCount
          :num="numServicos"
          icon="mdi-basket"
        >
          Serviços
        </AdminInfoCount>
      </v-col>
      <v-col
        v-if="numPagamentos"
        cols="12"
        md="3"
      >
        <AdminInfoCount
          :num="numPagamentos"
          icon="mdi-credit-card-outline"
        >
          Pagamentos
        </AdminInfoCount>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'admin',
  data() {
    return {
      numUnidades: null,
      numServicos: null,
      numPagamentos: null,
    }
  },
  async fetch() {
    await this.$axios.get('/api/info/count')
    .then(response => {
      this.numUnidades = response.data.unidades || null;
      this.numServicos = response.data.servicos || null;
      this.numPagamentos = response.data.pagamentos || null;
    })
    .catch(error => {
      this.$toast.error('Ocorreu um erro ao carregar as informações sobre o sistema: ' + error.message);
      console.error(error);
    });
  },
  head: {
    title: 'Área Administrativa',
  },
}
</script>
