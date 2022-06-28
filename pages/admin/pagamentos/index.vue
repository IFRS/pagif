<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Pagamentos</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :loading="$fetchState.pending"
          :headers="tableHeaders"
          :items="pagamentos"
          :items-per-page="10"
          :search="busca"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-text-field
                v-model="busca"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-btn
                class="mr-1"
                color="secondary"
                :loading="$fetchState.pending"
                :disabled="$fetchState.pending"
                @click="$fetch()"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn
                color="primary"
                to="/admin/pagamentos/novo"
              >
                <v-icon>mdi-plus</v-icon>
                Nova Cobran&ccedil;a
              </v-btn>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  :disabled="(item.tipoPagamentoEscolhido === 'BOLETO') || ['CONCLUIDO', 'REJEITADO', 'CANCELADO'].includes(item.situacao.codigo)"
                  :loading="item.idPagamento === loadingPagamento"
                  @click="consultaPagamento(item)"
                >
                  <v-icon>mdi-cloud-refresh</v-icon>
                </v-btn>
              </template>
              <span>Consultar Pagamento {{ item.idPagamento }}</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  :disabled="item.situacao.codigo !== 'CRIADO'"
                  @click="confirmDelete(item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Deletar Pagamento {{ item.idPagamento }}</span>
            </v-tooltip>
          </template>
          <template slot="no-data">
            <v-alert
              dense
              type="info"
              class="my-3"
            >
              N&atilde;o h&aacute; Pagamentos cadastrados.
            </v-alert>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog
      v-model="confirmDialog"
      max-width="400"
      @click:outside="closeDelete()"
    >
      <v-card>
        <v-card-title class="text-h5">
          Deletar o Pagamento "{{ $store.getters['admin/pagamento/id'] }}"?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            text
            @click="closeDelete()"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="danger"
            text
            @click="deletePagamento()"
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';

  export default {
    name: 'Pagamentos',
    layout: 'admin',
    data() {
      return {
        confirmDialog: false,
        loadingPagamento: false,
        busca: '',
        tableHeaders: [
          { text: 'ID', value: 'idPagamento' },
          { text: 'Código do Serviço', value: 'codigoServico' },
          { text: 'Contribuinte', value: 'nomeContribuinte' },
          { text: 'Valor Principal', value: 'valorPrincipal' },
          { text: 'Situação', value: 'situacao.codigo' },
          { text: 'Ações', value: 'actions', sortable: false, align: 'center', width: 120 },
        ],
      }
    },
    computed: {
      pagamentos: {
        ...mapGetters({ get: 'admin/getPagamentos' }),
        ...mapMutations({ set: 'admin/setPagamentos' }),
      },
    },
    async fetch() {
      await this.$store.dispatch('admin/fetchPagamentos')
      .catch((error) => {
        this.$toast.error('Ocorreu um erro ao carregar os Pagamentos: ' + error.message);
        console.log(error);
      });
    },
    methods: {
      confirmDelete(pagamento) {
        this.$store.commit('admin/pagamento/replace', pagamento);
        this.confirmDialog = true;
      },
      closeDelete() {
        this.$store.commit('admin/pagamento/clear');
        this.confirmDialog = false;
      },
      async consultaPagamento(item) {
        this.loadingPagamento = item.idPagamento;
        await this.$store.dispatch('admin/consultaPagamento', item.idPagamento)
        .then(() => {
          this.$toast.success(`Pagamento ${item.idPagamento} atualizado!`);
        })
        .catch((error) => {
          console.error(error);
          this.$toast.error('Erro ao tentar consultar o Pagamento. ' + error.message);
        })
        .finally(() => {
          this.loadingPagamento = false;
        });
      },
      async deletePagamento() {
        this.confirmDialog = false;
        await this.$store.dispatch('admin/pagamento/delete')
        .then(() => {
          this.$toast.success('Pagamento removido com sucesso!');
        })
        .catch((error) => {
          console.error(error);
          this.$toast.error('Erro ao tentar deletar o Pagamento. ' + error.message);
        });
      },
    },
  };
</script>
