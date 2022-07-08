<template>
  <v-container>
    <v-card :loading="$fetchState.pending">
      <v-card-title primary-title>
        Pagamento criado com sucesso!
      </v-card-title>
      <v-card-text>
        Pague agora ou salve o Código do Pagamento abaixo para pagar em outro momento.
      </v-card-text>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>{{ $store.getters['pagamento/idPagamento'] }}</v-list-item-title>
          <v-list-item-subtitle>Código do Pagamento</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-card-actions>
        <v-dialog
          v-model="voltarDialog"
          width="500"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              v-bind="attrs"
              v-on="on"
            >
              Voltar
            </v-btn>
          </template>

          <v-card>
            <v-card-title>
              Atenção!
              <v-spacer></v-spacer>
              <v-icon @click="voltarDialog = false;">mdi-close</v-icon>
            </v-card-title>

            <v-card-text>
              Lembre-se de anotar o Código do Pagamento para acesso posterior. Sem esse código <strong>não</strong> é possível realizar esse pagamento.
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click="$router.push({name: 'pagamento' })"
              >
                Estou Ciente, Prosseguir
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn
          text
          color="primary"
          @click="$router.push({name: 'pagar-id', params: { id: $store.getters['pagamento/idPagamento'] } })"
        >
          Pagar Agora
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'PagamentoCriado',
  data() {
    return {
      voltarDialog: false,
    }
  },
  async fetch() {
    await this.$store.dispatch('pagamento/show', this.$route.params.id)
    .catch((error) => {
      this.$toast.error('Ocorreu um erro ao buscar o Pagamento. ' + error.message);
      console.error(error);
    })
  },
  destroyed () {
    this.$store.commit('pagamento/clear');
  },
}
</script>
