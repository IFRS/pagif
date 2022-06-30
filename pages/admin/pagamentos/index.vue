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
            <span :class="situacaoColor(value)">{{ value }}</span>
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
    <v-dialog
      v-model="pagamentoDialog"
      scrollable
      :fullscreen="$vuetify.breakpoint.xsOnly"
      max-width="800"
      @click:outside="hidePagamento()"
    >
      <v-card>
        <v-card-title class="text-h5">
          Pagamento {{ $store.getters['admin/pagamento/idPagamento'] }}
        </v-card-title>
        <v-card-subtitle>
          Serviço {{ $store.getters['admin/pagamento/codigoServico'] }}
        </v-card-subtitle>
        <v-card-text>
          <v-row>
            <v-col md="6">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Nome do Contribuinte</v-list-item-title>
                  <v-list-item-subtitle>{{ $store.getters['admin/pagamento/nomeContribuinte'] }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>CPF / CNPJ</v-list-item-title>
                  <v-list-item-subtitle>{{ $format.cnpjCpf($store.getters['admin/pagamento/cnpjCpf']) || '-' }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Refer&ecirc;ncia</v-list-item-title>
                  <v-list-item-subtitle>{{ $store.getters['admin/pagamento/referencia'] || '-' }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col md="6">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Compet&ecirc;ncia</v-list-item-title>
                  <v-list-item-subtitle>{{ $dayjs($store.getters['admin/pagamento/competencia']).isValid() ? $dayjs($store.getters['admin/pagamento/competencia']).format('MM/YYYY') : '-' }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Vencimento</v-list-item-title>
                  <v-list-item-subtitle>{{ $dayjs($store.getters['admin/pagamento/vencimento']).isValid() ? $dayjs($store.getters['admin/pagamento/vencimento']).format('DD/MM/YYYY') : '-' }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Data de Cria&ccedil;&atilde;o</v-list-item-title>
                  <v-list-item-subtitle>{{ $dayjs($store.getters['admin/pagamento/dataCriacao']).isValid() ? $dayjs($store.getters['admin/pagamento/dataCriacao']).format('DD/MM/YYYY [às] HH:mm:ss') : '-' }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col md="6">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Valor Principal</v-list-item-title>
                  <v-list-item-subtitle>{{ $format.intToMoeda($store.getters['admin/pagamento/valorPrincipal'], true) }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Descontos</v-list-item-title>
                  <v-list-item-subtitle>{{ $format.intToMoeda($store.getters['admin/pagamento/valorDescontos'], true) || '-' }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Outras Dedu&ccedil;&otilde;es</v-list-item-title>
                  <v-list-item-subtitle>{{ $format.intToMoeda($store.getters['admin/pagamento/valorOutrasDeducoes'], true) || '-' }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Multa</v-list-item-title>
                  <v-list-item-subtitle>{{ $format.intToMoeda($store.getters['admin/pagamento/valorMulta'], true) || '-' }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Juros</v-list-item-title>
                  <v-list-item-subtitle>{{ $format.intToMoeda($store.getters['admin/pagamento/valorJuros'], true) || '-' }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Outros Acr&eacute;scimos</v-list-item-title>
                  <v-list-item-subtitle>{{ $format.intToMoeda($store.getters['admin/pagamento/valorOutrosAcrescimos'], true) || '-' }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col md="6">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Valor Total</v-list-item-title>
                  <v-list-item-subtitle>{{ $format.intToMoeda($store.getters['admin/pagamento/valor'], true) || '-' }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Endere&ccedil;o para Pagamento</v-list-item-title>
                  <nuxt-link
                    :to="{ name: 'pagar-id', params: { id: $store.getters['admin/pagamento/id'] } }"
                    v-slot="{ href, route, navigate, isActive, isExactActive }"
                  >
                    <a :href="href" @click="navigate">{{ route.fullPath }}</a>
                  </nuxt-link>
                </v-list-item-content>
              </v-list-item>

              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Tipo de Pagamento Escolhido</v-list-item-title>
                  <v-list-item-subtitle>{{ $store.getters['admin/pagamento/tipoPagamentoEscolhido'] || '-' }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Prestador de Servi&ccedil;o de Pagamento</v-list-item-title>
                  <v-list-item-subtitle>{{ $store.getters['admin/pagamento/nomePSP'] || '-' }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Transa&ccedil;&atilde;o</v-list-item-title>
                  <v-list-item-subtitle>{{ $store.getters['admin/pagamento/transacaoPSP'] || '-' }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Situa&ccedil;&atilde;o</v-list-item-title>
                  <v-list-item-subtitle><span :class="situacaoColor($store.getters['admin/pagamento/situacao'].codigo)">{{ $store.getters['admin/pagamento/situacao'].codigo || '' }}</span>{{ $dayjs($store.getters['admin/pagamento/situacao'].data).isValid() ? ' em ' + $dayjs($store.getters['admin/pagamento/situacao'].data).format('DD/MM/YYYY [às] HH:mm:ss') : '' }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            text
            color="primary"
            @click="hidePagamento()"
          >
            Fechar
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
      situacaoColor(situacao) {
        switch (situacao) {
          case 'CRIADO':
            return 'indigo--text text--lighten-3';
          break;
          case 'INICIADO':
            return 'cyan--text text--lighten-3';
          break;
          case 'SUBMETIDO':
            return 'brown--text text-lighten-3';
          break;
          case 'CONCLUIDO':
            return 'success--text';
          break;
          case 'REJEITADO':
            return 'warning--text';
          break;
          case 'CANCELADO':
            return 'error--text';
          break;
          default:
            return '';
          break;
        }
      },
      showPagamento(item) {
        if (item) {
          this.$store.commit('admin/pagamento/replace', item);
          this.pagamentoDialog = true;
        }
      },
      hidePagamento() {
        this.pagamentoDialog = false;
        this.$store.commit('admin/pagamento/clear');
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
