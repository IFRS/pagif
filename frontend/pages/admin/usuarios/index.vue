<template>
  <v-container>
    <v-row>
      <v-col>
        <PageTitle>Usu&aacute;rios</PageTitle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- eslint-disable-next-line vuetify/no-deprecated-components -->
        <v-data-table
          :loading="pending"
          :headers="tableHeaders"
          :items="usuarios"
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
                label="Buscar Usuários"
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
                v-if="useACL().can('create', 'Usuario')"
                color="primary"
                prepend-icon="mdi-plus"
                to="/admin/usuarios/novo"
              >
                Cadastrar Usu&aacute;rio
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
                  :disabled="useACL().cannot('update', 'Usuario') || useACL().cannot('delete', 'Usuario')"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list density="compact">
                <v-list-item
                  v-if="useACL().can('update', 'Usuario')"
                  prepend-icon="mdi-pencil"
                  @click="editUsuario(item.raw)"
                >
                  <v-list-item-title>Editar {{ item.raw.nome || item.raw.email }}</v-list-item-title>
                </v-list-item>

                <v-list-item
                  v-if="useACL().can('delete', 'Usuario')"
                  prepend-icon="mdi-delete"
                  @click.stop="confirmDelete(item.raw)"
                >
                  <v-list-item-title>Deletar {{ item.raw.nome || item.raw.email }}</v-list-item-title>
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
              N&atilde;o h&aacute; Usu&aacute;rios cadastrados.
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
          Deletar o Usu&aacute;rio "{{ usuarioStore.nome || usuarioStore.email }}"?
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
            @click="deleteUsuario()"
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
import { useMainStore } from '~/store';
import { useUsuarioStore } from '~/store/usuario';

definePageMeta({
  title: 'Lista de Usuários',
  validate: async () => {
    return useACL().can('read', 'Usuario')
  }
})

const store = useMainStore()
const { usuarios } = storeToRefs(store)

const usuarioStore = useUsuarioStore()

const { error, pending, refresh } = await store.fetchUsuarios()
if (error.value) {
  useToast().error('Ocorreu um erro ao carregar os Usuários: ' + error.message)
  console.error(error)
}

const confirmDialog = ref(false)
const busca = ref('')
const tableHeaders = [
  { title: 'E-mail', key: 'email' },
  { title: 'Nome', key: 'nome' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'center', width: 80 },
]

async function editUsuario(usuario) {
  usuarioStore.$patch(usuario)
  await navigateTo({ path: '/admin/usuarios/editar' })
}

function confirmDelete(usuario) {
  usuarioStore.$patch(usuario)
  confirmDialog.value = true
}

function closeDelete() {
  usuarioStore.$reset()
  confirmDialog.value = false
}

async function deleteUsuario() {
  confirmDialog.value = false

  const { error } = usuarioStore.delete()
  if (error.value) {
    useToast().error('Erro ao tentar deletar o Usuário. ' + error.message)
    console.error(error)
  } else {
    useToast().success('Usuário removido com sucesso!')
  }
}
</script>
