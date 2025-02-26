<template>
  <v-container>
    <v-row>
      <v-col>
        <PageTitle>Unidades Gestoras</PageTitle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          loading-text="Carregando Unidades..."
          :loading="status == 'pending'"
          :headers="tableHeaders"
          :items="unidades"
          :items-per-page="10"
          :search="busca"
        >
          <template #top>
            <v-toolbar
              flat
              color="transparent"
            >
              <v-text-field
                v-model="busca"
                prepend-inner-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
                variant="underlined"
              />
              <v-spacer />
              <v-btn
                icon
                color="secondary"
                :loading="status == 'pending'"
                class="mr-2"
                @click="refresh()"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn
                v-if="useACL().can('create', 'Unidade')"
                color="primary"
                prepend-icon="mdi-plus"
                to="/admin/unidades/nova"
              >
                Nova Unidade
              </v-btn>
            </v-toolbar>
          </template>
          <template #item.actions="{ item }">
            <v-menu
              location="bottom"
              :close-on-content-click="false"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  variant="text"
                  :disabled="useACL().cannot('update', 'Unidade') || useACL().cannot('delete', 'Unidade')"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list density="compact">
                <v-list-item
                  :disabled="tokenLoading === item._id"
                  @click="showTokenDialog(item)"
                >
                  <template #prepend>
                    <v-progress-linear
                      :active="tokenLoading === item._id"
                      indeterminate
                      absolute
                      location="bottom"
                    />
                    <v-icon>
                      mdi-key
                    </v-icon>
                  </template>
                  <v-list-item-title>Ver Token de {{ item.nome }}</v-list-item-title>
                </v-list-item>

                <v-list-item
                  v-if="useACL().can('update', 'Unidade')"
                  prepend-icon="mdi-pencil"
                  :to="`/admin/unidades/editar/${item._id}`"
                >
                  <v-list-item-title>Editar {{ item.nome }}</v-list-item-title>
                </v-list-item>

                <v-list-item
                  v-if="useACL().can('delete', 'Unidade')"
                  prepend-icon="mdi-delete"
                  @click="confirmDelete(item)"
                >
                  <v-list-item-title>Deletar {{ item.nome }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          <template #no-data>
            <v-alert
              density="compact"
              type="info"
              class="my-3"
            >
              N&atilde;o h&aacute; Unidades cadastradas.
            </v-alert>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog
      v-model="tokenDialog"
      max-width="500"
    >
      <v-card>
        <v-card-title>
          Token PagTesouro
        </v-card-title>
        <v-card-subtitle>
          {{ unidadeStore.nome }}
        </v-card-subtitle>
        <v-card-text>
          {{ unidadeStore.token }}
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="confirmDialog"
      max-width="400"
    >
      <v-card>
        <v-card-title class="text-h5">
          Deletar a Unidade "{{ unidadeStore.nome }}"?
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
            @click="deleteUnidade()"
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
definePageMeta({
  validate: async () => {
    return useACL().can('read', 'Unidade')
  },
})

useHeadSafe({
  title: 'Lista de Unidades',
})

const busca = ref('')

const tableHeaders = [
  { title: 'Nome', key: 'nome' },
  { title: 'Slug', key: 'slug' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'center', width: 80 },
]

const store = useMainStore()
const { unidades } = storeToRefs(store)

const { error, status, refresh } = await useFetch('/api/unidades', {
  onResponse: ({ response }) => {
    unidades.value = response._data
  },
})

if (error.value) {
  useToast().error('Ocorreu um erro ao carregar as Unidades Gestoras: ' + error.value.message)
  console.error(error)
}

const unidadeStore = useUnidadeStore()

const tokenLoading = ref(false)
const tokenDialog = ref(false)

watch(tokenDialog, async (newValue) => {
  if (newValue === false) {
    unidadeStore.$reset()
  }
})

async function showTokenDialog(item) {
  tokenLoading.value = item._id

  unidadeStore.$patch(item)

  try {
    const token = await $fetch(`/api/unidades/token/${item._id}`)

    unidadeStore.token = token

    tokenDialog.value = true
  } catch (error) {
    useToast().error('Ocorreu um erro ao buscar o Token da Unidade Gestora: ' + error.message)
    console.error(error)
  } finally {
    tokenLoading.value = false
  }
}

const confirmDialog = ref(false)

function confirmDelete(unidade) {
  unidadeStore.$patch(unidade)
  confirmDialog.value = true
}

function closeDelete() {
  unidadeStore.$reset()
  confirmDialog.value = false
}

async function deleteUnidade() {
  confirmDialog.value = false

  try {
    await $fetch(`/api/unidades/${unidadeStore._id}`, {
      method: 'DELETE',
      onResponse({ response }) {
        unidadeStore.$reset()
        store.removeUnidade(response._data)
      },
    })

    useToast().success('Unidade Gestora removida com sucesso!')
  } catch (error) {
    useToast().error('Erro ao tentar deletar a Unidade Gestora. ' + error.value.message)
    console.error(error)
  }
}
</script>
