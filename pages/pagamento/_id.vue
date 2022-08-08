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
        <v-list-item-action>
          <v-btn
            icon
            @click="copy($store.getters['pagamento/idPagamento'])"
          >
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </v-list-item-action>
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
              class="mr-5"
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
              Lembre-se de anotar o Código do Pagamento para acesso posterior. Sem esse código <strong>não</strong> é possível retomar esse pagamento.
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                :to="{ name: 'index' }"
              >
                Estou ciente, quero sair dessa tela
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="pagarDialog"
          width="500"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              text
              color="primary"
            >
              Pagar Agora
            </v-btn>
          </template>

          <v-card>
            <v-card-title>
              Atenção!
              <v-spacer></v-spacer>
              <v-icon @click="pagarDialog = false;">mdi-close</v-icon>
            </v-card-title>

            <v-card-text>
              Ao iniciar o pagamento <strong>não</strong> será mais possível voltar em outro momento.
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                :to="{ name: 'pagar-id', params: { id: $store.getters['pagamento/idPagamento'] } }"
              >
                Estou ciente, prosseguir para o pagamento
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
      pagarDialog: false,
    }
  },
  async fetch() {
    await this.$store.dispatch('pagamento/show', this.$route.params.id)
    .catch((error) => {
      this.$toast.error('Ocorreu um erro ao buscar o Pagamento. ' + error.message);
      console.error(error);
    })
  },
  methods: {
    copy(text) {
      if (Navigator.clipboard) {
        Navigator.clipboard.writeText(text)
        .then(() => {
          this.$toast.success('Código do Pagamento copiado com sucesso!');
        });
      } else {
        this.$toast.info('Seu navegador não suporta esse recurso.');
      }
    }
  },
  destroyed () {
    this.$store.commit('pagamento/clear');
  },
}
</script>
