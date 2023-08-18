<template>
  <v-container>
    <v-row>
      <v-col>
        <PageTitle>
          Pagamentos
          <small
            v-if="!filtros || !filtros.datas || filtros.datas.length === 0"
            class="text-info text-caption float-md-right d-block d-md-inline-block"
          >
            <v-icon
              color="info"
              size="small"
            >mdi-information-outline</v-icon>
            Exibindo Pagamentos dos &uacute;ltimos <strong>30 dias</strong>. Para alterar esse comportamento, utilize os Filtros.
          </small>
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
          :loading="pending"
          :headers="tableHeaders"
          :items="pagamentos"
          :items-per-page="25"
          :search="busca"
          :footer-props="tableFooterProps"
          @click:row="showPagamento"
        >
          <template #top>
            <v-toolbar
              flat
              color="transparent"
            >
              <v-text-field
                v-model="busca"
                prepend-inner-icon="mdi-magnify"
                label="Buscar Pagamentos"
                single-line
                hide-details
                variant="underlined"
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
                :loading="pending"
                @click="refresh()"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn
                v-if="useACL().can('create', 'Pagamento')"
                color="primary"
                to="/admin/pagamentos/novo"
              >
                <v-icon>mdi-plus</v-icon>
                Nova Cobran&ccedil;a
              </v-btn>
            </v-toolbar>
          </template>
          <template #item.nomeServico="{ item }">
            {{ item.raw.nomeServico }} ({{ item.raw.codigoServico }})
          </template>
          <template #item.cnpjCpf="{ value }">
            {{ $filters.cnpj_cpf(value) }}
          </template>
          <template #item.valor="{ item }">
            <v-icon size="small">
              mdi-currency-brl
            </v-icon> {{ handleValor(item.raw) || '-' }}
          </template>
          <template #item.situacao="{ value }">
            <pagamento-situacao
              :situacao="value.codigo"
              class="mt-1"
            />
            <template v-if="value.data">
              <br>
              <small>{{ dayjs(value.data).format('DD/MM/YYYY HH:mm') }}</small>
            </template>
          </template>
          <template #item.actions="{ item }">
            <v-progress-circular
              v-if="item.raw.idPagamento === loadingPagamento"
              indeterminate
              :size="20"
              :width="2"
            />
            <v-menu
              v-else
              location="bottom"
              :close-on-content-click="true"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  :disabled="useACL().cannot('update', 'Pagamento') || useACL().cannot('delete', 'Pagamento')"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list density="compact">
                <v-list-item
                  v-if="useACL().can('update', 'Pagamento')"
                  prepend-icon="mdi-cloud-refresh"
                  :disabled="(item.raw.tipoPagamentoEscolhido === 'BOLETO') || ['CONCLUIDO', 'REJEITADO', 'CANCELADO'].includes(item.raw.situacao.codigo)"
                  @click.stop="consultaPagamento(item.raw)"
                >
                  <v-list-item-title>Consulta Pagtesouro</v-list-item-title>
                </v-list-item>

                <v-list-item
                  v-if="useACL().can('delete', 'Pagamento')"
                  prepend-icon="mdi-delete"
                  :disabled="item.raw.situacao.codigo !== 'CRIADO'"
                  @click.stop="confirmDelete(item.raw)"
                >
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
    >
      <v-card>
        <v-card-title class="text-h5">
          Deletar o Pagamento "{{ id }}"?
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
      :fullscreen="xs"
      max-width="800"
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

<script setup>
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import useToast from '~/composables/useToast'
import { useMainStore } from '~/store'
import { usePagamentoStore } from '~/store/pagamento'

definePageMeta({
  layout: 'admin',
  title: 'Lista de Pagamentos',
  validate: async () => {
    return useACL().can('read', 'Pagamento')
  }
})

const dayjs = useDayjs()

const { xs } = useDisplay()

const tableHeaders = [
  { title: 'ID', key: 'idPagamento' },
  { title: 'Unidade', key: 'nomeUnidade' },
  { title: 'Serviço', key: 'nomeServico' },
  { title: 'Contribuinte', key: 'nomeContribuinte' },
  { title: 'CPF / CNPJ', key: 'cnpjCpf' },
  { title: 'Valor', key: 'valor' },
  { title: 'Situação', key: 'situacao' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'center', width: 80 },
]

const tableFooterProps = {
  'items-per-page-text': 'Pagamentos por página:',
  'items-per-page-options': [
    10, 25, 50, -1
  ],
}

const busca = ref('')
const showFiltros = ref(false)
const filtros = ref({})

const store = useMainStore()
const { pagamentos } = storeToRefs(store)

const pagamentoStore = usePagamentoStore()

const { error, pending, refresh } = await store.fetchPagamentos()
if (error.value) {
  useToast().error('Ocorreu um erro ao carregar os Pagamentos: ' + error.message)
  console.error(error)
}

const confirmDialog = ref(false)
const pagamentoDialog = ref(false)
watch(pagamentoDialog, (newValue) => {
  if (newValue === false) {
    pagamentoStore.$reset()
  }
})

const loadingPagamento = ref(false)

function handleValor(item) {
  if (!item.valor) {
    const valor = item.valorPrincipal
      - (item.valorDescontos || 0)
      - (item.valorOutrasDeducoes || 0)
      + (item.valorMulta || 0)
      + (item.valorJuros || 0)
      + (item.valorOutrosAcrescimos || 0)
    return $filters.int_to_real(valor)
  }

  return $filters.int_to_real(item.valor)
}

function showPagamento(item) {
  if (item) {
    pagamentoStore.$patch(item)
    pagamentoDialog.value = true
  }
}

function hidePagamento() {
  pagamentoDialog.value = false
}

function confirmDelete(pagamento) {
  pagamentoStore.$patch(pagamento)
  confirmDialog.value = true
}

function closeDelete() {
  pagamentoStore.$reset()
  confirmDialog.value = false
}

async function handleFiltrar(filtros) {
  filtros.value = filtros
  refresh()
}

async function consultaPagamento(item) {
  loadingPagamento.value = item.idPagamento

  const { error, status } = await pagamentoStore.consulta(item.idPagamento)

  if (error.value) {
    useToast().error('Erro ao tentar consultar o Pagamento. ' + error.message)
    console.error(error)
  } else {
    if (status === 204) {
      useToast().info(`Pagamento ${item.idPagamento} sem atualizações!`)
    } else {
      useToast().success(`Pagamento ${item.idPagamento} atualizado!`)
    }
  }

  loadingPagamento.value = false
}

async function deletePagamento() {
  confirmDialog.value = false

  const { error } = await pagamentoStore.delete()

  if (error.value) {
    useToast().error('Erro ao tentar deletar o Pagamento. ' + error.message)
    console.error(error)
  } else {
    useToast().success('Pagamento removido com sucesso!')
  }
}
</script>

<style lang="scss" scoped>
  :deep(.v-data-table__wrapper > table > tbody > tr:hover) {
    cursor: pointer;
  }
</style>
