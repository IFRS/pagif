<template>
  <v-container>
    <v-row>
      <v-col v-if="numUnidades" cols="auto">
        <v-card>
          <v-card-title primary-title>
            {{ numUnidades }}
          </v-card-title>
          <v-card-subtitle primary-title>
            Unidades
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col v-if="numServicos" cols="auto">
        <v-card>
          <v-card-title primary-title>
            {{ numServicos }}
          </v-card-title>
          <v-card-subtitle primary-title>
            Serviços
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col v-if="numPagamentos" cols="auto">
        <v-card>
          <v-card-title primary-title>
            {{ numPagamentos }}
          </v-card-title>
          <v-card-subtitle primary-title>
            Pagamentos
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'AdminIndex',
  layout: 'admin',
  head: {
    title: 'Área Administrativa',
  },
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
}
</script>
