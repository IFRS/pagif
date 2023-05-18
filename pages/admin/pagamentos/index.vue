<template>
  <v-container>
    <v-row>
      <v-col>
        <PageTitle>
          Pagamentos
          <small
            v-if="!filtros || !filtros.datas || filtros.datas.length === 0"
            class="text-info text-caption float-md-right d-block d-md-inline-block"
          ><v-icon
            color="info"
            size="small"
          >mdi-information-outline</v-icon> Exibindo Pagamentos dos &uacute;ltimos <strong>30 dias</strong>. Para alterar esse comportamento, utilize os Filtros.</small>
        </PageTitle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <FilterPainel
          v-model="showFiltros"
          @filtrar="handleFiltrar"
        >
          <FilterUnidades />
          <FilterSituacoes />
          <FilterDatas />
        </FilterPainel>
        <v-data-table
          class="pagamentos"
          :loading="$fetchState.pending"
          :headers="tableHeaders"
          :items="pagamentos"
          :items-per-page="25"
          :search="busca"
          :footer-props="tableFooterProps"
          @click:row="showPagamento"
        >
          <template #top>
            <v-toolbar flat>
              <v-text-field
                v-model="busca"
                append-icon="mdi-magnify"
                label="Buscar Pagamentos"
                single-line
                hide-details
                class="mr-5"
              />
              <v-btn
                variant="text"
                :color="(Object.values(filtros).length > 0) ? 'accent' : ''"
                @click="showFiltros = !showFiltros"
              >
                <v-icon>mdi-filter-variant</v-icon>
                Filtros
              </v-btn>
              <v-spacer />
              <v-btn
                class="mr-2"
                color="secondary"
                :loading="$fetchState.pending"
                @click="$fetch()"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn
                v-if="$acl.can('create', 'Pagamento')"
                color="primary"
                to="/admin/pagamentos/novo"
              >
                <v-icon>mdi-plus</v-icon>
                Nova Cobran&ccedil;a
              </v-btn>
            </v-toolbar>
          </template>
          <template #item.nomeServico="{ item }">
            {{ item.nomeServico }} ({{ item.codigoServico }})
          </template>
          <template #item.cnpjCpf="{ value }">
            {{ $filters.cnpj_cpf(value) }}
          </template>
          <template #item.valor="{ item }">
            <v-icon size="small">
              mdi-currency-brl
            </v-icon> {{ handleValor(item) || '-' }}
          </template>
          <template #item.situacao="{ value }">
            <pagamento-situacao
              :situacao="value.codigo"
              class="mt-1"
            />
            <template v-if="value.data">
              <br>
              <small>{{ $dayjs(value.data).format('DD/MM/YYYY HH:mm') }}</small>
            </template>
          </template>
          <template #item.actions="{ item }">
            <v-progress-circular
              v-if="item.idPagamento === loadingPagamento"
              indeterminate
              :size="20"
              :width="2"
            />
            <v-menu
              v-else
              location="bottom"
              :offset-x="true"
              :close-on-content-click="true"
            >
              <template #activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  icon
                  :disabled="$acl.cannot('update', 'Pagamento') || $acl.cannot('delete', 'Pagamento')"
                  v-on="on"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list density="compact">
                <v-list-item
                  v-if="$acl.can('update', 'Pagamento')"
                  :disabled="(item.tipoPagamentoEscolhido === 'BOLETO') || ['CONCLUIDO', 'REJEITADO', 'CANCELADO'].includes(item.situacao.codigo)"
                  @click.stop="consultaPagamento(item)"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-cloud-refresh</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Consulta Pagtesouro</v-list-item-title>
                </v-list-item>

                <v-list-item
                  v-if="$acl.can('delete', 'Pagamento')"
                  :disabled="item.situacao.codigo !== 'CRIADO'"
                  @click.stop="confirmDelete(item)"
                >
                  <v-list-item-icon><v-icon>mdi-delete</v-icon></v-list-item-icon>
                  <v-list-item-title>Deletar Pagamento</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          <template #no-data>
            <v-alert
              density="compact"
              text
              type="info"
              class="my-3"
            >
              N&atilde;o foram encontrados Pagamentos.
              <template v-if="(Object.values(filtros).length > 0)">
                Tente editar ou limpar os Filtros.
              </template>
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
          Deletar o Pagamento "{{ $store.getters['pagamento/id'] }}"?
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="secondary"
            variant="text"
            @click="closeDelete()"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="danger"
            variant="text"
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
      @click:outside="hidePagamento"
    >
      <pagamento-detalhes privado>
        <v-btn
          variant="text"
          color="primary"
          @click="hidePagamento"
        >
          Fechar
        </v-btn>
      </pagamento-detalhes>
    </v-dialog>
  </v-container>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';

  export default {
    name: 'Pagamentos',
    layout: 'admin',
    validate({ app }) {
      return app.$acl.can('read', 'Pagamento');
    },
    data() {
      return {
        confirmDialog: false,
        pagamentoDialog: false,
        loadingPagamento: false,
        busca: '',
        tableHeaders: [
          { text: 'ID', value: 'idPagamento' },
          { text: 'Unidade', value: 'nomeUnidade' },
          { text: 'Serviço', value: 'nomeServico' },
          { text: 'Contribuinte', value: 'nomeContribuinte' },
          { text: 'CPF / CNPJ', value: 'cnpjCpf' },
          { text: 'Valor', value: 'valor' },
          { text: 'Situação', value: 'situacao' },
          { text: 'Ações', value: 'actions', sortable: false, align: 'center', width: 80 },
        ],
        tableFooterProps: {
          'items-per-page-text': 'Pagamentos por página:',
          'items-per-page-options': [
            10, 25, 50, -1
          ],
        },
        showFiltros: false,
        filtros: {},
      }
    },
    async fetch() {
      await this.$store.dispatch('fetchPagamentos', this.filtros)
      .catch((error) => {
        this.$toast.error('Ocorreu um erro ao carregar os Pagamentos: ' + error.message);
        console.error(error);
      });
    },
    head: {
      title: 'Lista de Pagamentos',
    },
    computed: {
      pagamentos: {
        ...mapGetters({ get: 'pagamentos' }),
        ...mapMutations({ set: 'setPagamentos' }),
      },
    },
    watch: {
      pagamentoDialog(newValue) {
        if (newValue === false) {
          this.$store.commit('pagamento/clear');
        }
      }
    },
    methods: {
      handleValor(item) {
        if (!item.valor) {
          const valor = item.valorPrincipal
            - (item.valorDescontos || 0)
            - (item.valorOutrasDeducoes || 0)
            + (item.valorMulta || 0)
            + (item.valorJuros || 0)
            + (item.valorOutrosAcrescimos || 0);
          return this.$root.$options.filters.int_to_real(valor);
        }

        return this.$root.$options.filters.int_to_real(item.valor);
      },
      showPagamento(item) {
        if (item) {
          this.$store.commit('pagamento/replace', item);
          this.pagamentoDialog = true;
        }
      },
      hidePagamento() {
        this.pagamentoDialog = false;
      },
      confirmDelete(pagamento) {
        this.$store.commit('pagamento/replace', pagamento);
        this.confirmDialog = true;
      },
      closeDelete() {
        this.$store.commit('pagamento/clear');
        this.confirmDialog = false;
      },
      async handleFiltrar(filtros) {
        this.filtros = filtros;
        this.$fetch();
      },
      async consultaPagamento(item) {
        this.loadingPagamento = item.idPagamento;
        await this.$store.dispatch('pagamento/consulta', item.idPagamento)
        .then((status) => {
          if (status === 204) {
            this.$toast.info(`Pagamento ${item.idPagamento} sem atualizações!`);
          } else {
            this.$toast.success(`Pagamento ${item.idPagamento} atualizado!`);
          }
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
        await this.$store.dispatch('pagamento/delete')
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
  :deep(.v-data-table__wrapper > table > tbody > tr:hover) {
    cursor: pointer;
  }
</style>
