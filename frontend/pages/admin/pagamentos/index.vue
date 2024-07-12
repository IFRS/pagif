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
        <FormPagamentoFilters
          v-model="showFiltros"
          @filtrar="handleFiltrar"
        />
        <v-data-table
          class="pagamentos"
          loading-text="Carregando Pagamentos..."
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
                hide-details
                variant="outlined"
                class="mr-5"
              />
              <v-btn
                variant="text"
                :color="!filtrosEmpty ? 'success' : ''"
                @click="showFiltros = !showFiltros"
              >
                <v-icon>mdi-filter-variant</v-icon>
                Filtros
              </v-btn>
              <v-spacer />
              <v-btn
                icon
                color="secondary"
                :loading="pending"
                class="mr-2"
                @click="refresh()"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn
                v-if="useACL().can('create', 'Pagamento')"
                color="primary"
                prepend-icon="mdi-plus"
                to="/admin/pagamentos/novo"
              >
                Nova Cobran&ccedil;a
              </v-btn>
            </v-toolbar>
          </template>
          <template #item.nomeServico="{ item }">
            {{ item.nomeServico }} ({{ item.codigoServico }})
          </template>
          <template #item.cnpjCpf="{ item }">
            {{ useFilters().cnpj_cpf(item.cnpjCpf) }}
          </template>
          <template #item.valor="{ item }">
            <v-icon size="small">
              mdi-currency-brl
            </v-icon> {{ handleValor(item) || '-' }}
          </template>
          <template #item.situacao="{ item }">
            <pagamento-situacao
              :situacao="item.situacao?.codigo"
              class="mt-1"
            />
            <br>
            <small>{{ dayjs(item.situacao?.data || item.dataCriacao).format('DD/MM/YYYY HH:mm') }}</small>
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
              :close-on-content-click="true"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  variant="text"
                  :disabled="useACL().cannot('update', 'Pagamento') && useACL().cannot('delete', 'Pagamento')"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list density="compact">
                <v-list-item
                  v-if="useACL().can('update', 'Pagamento')"
                  prepend-icon="mdi-cloud-refresh"
                  :disabled="(item.tipoPagamentoEscolhido === 'BOLETO') || ['CONCLUIDO', 'REJEITADO', 'CANCELADO'].includes(item.situacao?.codigo)"
                  @click.stop="consultaPagamento(item.idPagamento)"
                >
                  <v-list-item-title>Consulta Pagtesouro</v-list-item-title>
                </v-list-item>

                <v-list-item
                  v-if="useACL().can('delete', 'Pagamento')"
                  prepend-icon="mdi-delete"
                  :disabled="item.situacao?.codigo !== 'CRIADO'"
                  @click.stop="confirmDelete(item)"
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
            @click="confirmDialog = false"
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
      <PagamentoDetalhes privado>
        <v-btn
          variant="text"
          color="primary"
          @click="pagamentoDialog = false"
        >
          Fechar
        </v-btn>
      </PagamentoDetalhes>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { storeToRefs } from 'pinia'
import { useMainStore } from '~/store'
import { usePagamentoStore } from '~/store/pagamento'

definePageMeta({
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

const filtrosEmpty = computed(() => {
  return Object.values(filtros.value).every((filtro) => {
    if (Array.isArray(filtro)) return filtro.length === 0
    else return !filtro
  })
})

const store = useMainStore()
const { pagamentos } = storeToRefs(store)

const pagamentoStore = usePagamentoStore()

const { error, pending, refresh } = await useFetch('/api/pagamentos', {
  query: filtros,
  onResponse({ response }) {
    pagamentos.value = response._data
  },
})
if (error.value) {
  useToast().error('Ocorreu um erro ao carregar os Pagamentos: ' + error.value.message)
  console.error(error)
}

const confirmDialog = ref(false)
watch(confirmDialog, (newValue) => {
  if (newValue === false) {
    pagamentoStore.$reset()
  }
})

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
    return useFilters().int_to_real(valor)
  }

  return useFilters().int_to_real(item.valor)
}

function showPagamento(event, linha) {
  if (linha.item) {
    pagamentoStore.$patch(toRaw(linha.item))
    pagamentoDialog.value = true
  }
}

function confirmDelete(pagamento) {
  pagamentoStore.$patch(pagamento)
  confirmDialog.value = true
}

async function handleFiltrar(selectedFiltros) {
  filtros.value = { ...selectedFiltros }
}

async function consultaPagamento(idPagamento) {
  loadingPagamento.value = idPagamento

  const { error, status } = await pagamentoStore.consulta(idPagamento)

  if (error.value) {
    useToast().error('Erro ao tentar consultar o Pagamento. ' + error.value.message)
    console.error(error)
  } else {
    if (status === 204) {
      useToast().info(`Pagamento ${idPagamento} sem atualizações!`)
    } else {
      useToast().success(`Pagamento ${idPagamento} atualizado!`)
    }
  }

  loadingPagamento.value = false
}

async function deletePagamento() {
  confirmDialog.value = false

  const { error } = await pagamentoStore.delete()

  if (error.value) {
    useToast().error('Erro ao tentar deletar o Pagamento. ' + error.value.message)
    console.error(error)
  } else {
    useToast().success('Pagamento removido com sucesso!')
  }
}
</script>

<style lang="scss" scoped>
  :deep(.v-data-table__tr--clickable:hover) {
    background-color: rgb(var(--v-theme-surface));
  }
</style>
