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
          class="pagamentos"
          :loading="$fetchState.pending"
          :headers="tableHeaders"
          :items="pagamentos"
          :items-per-page="10"
          :search="busca"
          @click:row="showPagamento"
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
                class="mr-2"
                color="secondary"
                :loading="$fetchState.pending"
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
          <template v-slot:item.valor="{ item }">
            <v-icon small>mdi-currency-brl</v-icon> {{ handleValor(item) || '-' }}
          </template>
          <template v-slot:item.situacao.codigo="{ value }">
            <pagamento-situacao :situacao="value" />
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
                  @click.stop="consultaPagamento(item)"
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
                  @click.stop="confirmDelete(item)"
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
    <pagamento-dialog
      v-model="pagamentoDialog"
      scrollable
      :fullscreen="$vuetify.breakpoint.xsOnly"
      max-width="800"
      @close="hidePagamento"
    />
  </v-container>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';

  export default {
    name: 'Pagamentos',
    layout: 'admin',
    head: {
      title: 'Lista de Pagamentos',
    },
    data() {
      return {
        confirmDialog: false,
        pagamentoDialog: false,
        loadingPagamento: false,
        busca: '',
        tableHeaders: [
          { text: 'ID', value: 'idPagamento' },
          { text: 'Código do Serviço', value: 'codigoServico' },
          { text: 'Contribuinte', value: 'nomeContribuinte' },
          { text: 'Valor', value: 'valor' },
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
    watch: {
      pagamentoDialog(newValue, oldValue) {
        if (newValue === false) {
          this.$store.commit('admin/pagamento/clear');
        }
      }
    },
    async fetch() {
      await this.$store.dispatch('admin/fetchPagamentos')
      .catch((error) => {
        this.$toast.error('Ocorreu um erro ao carregar os Pagamentos: ' + error.message);
        console.log(error);
      });
    },
    methods: {
      handleValor(item) {
        if (!item.valor) {
          let valor = item.valorPrincipal
            - (item.valorDescontos || 0)
            - (item.valorOutrasDeducoes || 0)
            + (item.valorMulta || 0)
            + (item.valorJuros || 0)
            + (item.valorOutrosAcrescimos || 0);
          return this.$format.intToMoeda(valor);
        }

        return this.$format.intToMoeda(item.valor);
      },
      showPagamento(item) {
        if (item) {
          this.$store.commit('admin/pagamento/replace', item);
          this.pagamentoDialog = true;
        }
      },
      hidePagamento() {
        this.pagamentoDialog = false;
      },
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

<style lang="scss" scoped>
  ::v-deep .v-data-table__wrapper > table > tbody > tr:hover {
    cursor: pointer;
  }
</style>
