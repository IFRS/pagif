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
          :loading="pending"
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
                :loading="pending"
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
                  :loading="tokenLoading === item.raw._id"
                  @click="showTokenDialog(item.raw)"
                >
                  <template #prepend>
                    <v-progress-circular
                      v-if="tokenLoading === item.raw._id"
                      indeterminate
                      :size="20"
                      :width="2"
                    />
                    <v-icon v-else>
                      mdi-key
                    </v-icon>
                  </template>
                  <v-list-item-title>Ver Token de {{ item.raw.nome }}</v-list-item-title>
                </v-list-item>

                <v-list-item
                  v-if="useACL().can('update', 'Unidade')"
                  prepend-icon="mdi-pencil"
                  @click="editUnidade(item.raw)"
                >
                  <v-list-item-title>Editar {{ item.raw.nome }}</v-list-item-title>
                </v-list-item>

                <v-list-item
                  v-if="useACL().can('delete', 'Unidade')"
                  prepend-icon="mdi-delete"
                  @click="confirmDelete(item.raw)"
                >
                  <v-list-item-title>Deletar {{ item.raw.nome }}</v-list-item-title>
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
import { storeToRefs } from 'pinia';
import { useMainStore } from '~/store'
import { useUnidadeStore } from '~/store/unidade'

definePageMeta({
  title: 'Lista de Unidades',
  validate: async () => {
    return useACL().can('read', 'Unidade');
  }
})

const busca = ref('')

const tableHeaders = [
  { title: 'Nome', key: 'nome' },
  { title: 'Slug', key: 'slug' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'center', width: 80 },
]

const store = useMainStore()
const { unidades } = storeToRefs(store)

const { pending, refresh, error } = await store.fetchUnidades()
if (error.value) {
  useToast().error('Ocorreu um erro ao carregar as Unidades Gestoras: ' + error.message)
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

  const { error } = await unidadeStore.fetchToken(item._id)
  if (error.value) {
    useToast().error('Ocorreu um erro ao buscar o Token da Unidade Gestora: ' + error.message)
    console.error(error)
  }

  tokenDialog.value = true

  tokenLoading.value = false
}

async function editUnidade(unidade) {
  unidadeStore.$patch(unidade)
  await navigateTo({ path: '/admin/unidades/editar' })
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
  const { error } = await unidadeStore.delete()
  if (error.value) {
    useToast().error('Erro ao tentar deletar a Unidade Gestora. ' + error.message)
    console.error(error)
  } else {
    useToast().success('Unidade Gestora removida com sucesso!')
  }
}
</script>
