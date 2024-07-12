<template>
  <v-container>
    <v-row>
      <v-col>
        <PageTitle>Servi&ccedil;os</PageTitle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          loading-text="Carregando Serviços..."
          :loading="pending"
          :headers="tableHeaders"
          :items="servicos"
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
                v-if="useACL().can('create', 'Servico')"
                color="primary"
                prepend-icon="mdi-plus"
                to="/admin/servicos/novo"
              >
                Novo Servi&ccedil;o
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
                  :disabled="useACL().cannot('update', 'Servico') || useACL().cannot('delete', 'Servico')"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list density="compact">
                <v-list-item
                  v-if="useACL().can('update', 'Servico')"
                  prepend-icon="mdi-pencil"
                  @click="editServico(item)"
                >
                  <v-list-item-title>Editar {{ item.nome }}</v-list-item-title>
                </v-list-item>

                <v-list-item
                  v-if="useACL().can('delete', 'Servico')"
                  prepend-icon="mdi-delete"
                  @click.stop="confirmDelete(item)"
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
              N&atilde;o h&aacute; Serviços cadastrados.
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
          Deletar o Servi&ccedil;o "{{ servicoStore.nome }}"?
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
            @click="deleteServico()"
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useMainStore } from '~/store'
import { useServicoStore } from '~/store/servico'

definePageMeta({
  title: 'Lista de Serviços',
  validate: async () => {
    return useACL().can('read', 'Servico')
  }
})

const busca = ref('')

const tableHeaders = [
  { title: 'Unidade', key: 'unidade.nome' },
  { title: 'Código', key: 'codigo' },
  { title: 'Nome', key: 'nome' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'center', width: 80 },
]

const store = useMainStore()
const { servicos } = storeToRefs(store)

const { pending, refresh, error } = await store.fetchServicos()
if (error.value) {
  useToast().error('Ocorreu um erro ao carregar os Serviços: ' + error.value.message)
  console.error(error)
}

const confirmDialog = ref(false)

const servicoStore = useServicoStore()

async function editServico(servico) {
  servicoStore.$patch(servico)
  await navigateTo({ path: '/admin/servicos/editar' })
}

function confirmDelete(servico) {
  servicoStore.$patch(servico)
  confirmDialog.value = true
}

function closeDelete() {
  servicoStore.$reset()
  confirmDialog.value = false
}

async function deleteServico() {
  confirmDialog.value = false

  const { error } = await servicoStore.delete()
  if (error.value) {
    useToast().error('Erro ao tentar deletar o Serviço. ' + error.value.message)
    console.error(error)
  } else {
    useToast().success('Serviço removido com sucesso!')
  }
}
</script>
