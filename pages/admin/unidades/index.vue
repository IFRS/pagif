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
          :loading="$fetchState.pending"
          :headers="tableHeaders"
          :items="$store.getters['unidades']"
          :items-per-page="10"
          :search="busca"
        >
          <template #top>
            <v-toolbar flat>
              <v-text-field
                v-model="busca"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
              />
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
                v-if="$acl.can('create', 'Unidade')"
                color="primary"
                to="/admin/unidades/nova"
              >
                <v-icon>mdi-plus</v-icon>
                Nova Unidade
              </v-btn>
            </v-toolbar>
          </template>
          <template #item.actions="{ item }">
            <v-menu
              location="bottom"
              :close-on-content-click="false"
            >
              <template #activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  icon
                  :disabled="$acl.cannot('update', 'Unidade') || $acl.cannot('delete', 'Unidade')"
                  v-on="on"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list density="compact">
                <v-list-item
                  :loading="tokenLoading === item._id"
                  @click="showTokenDialog(item)"
                >
                  <template #prepend>
                    <v-progress-circular
                      v-if="tokenLoading === item._id"
                      indeterminate
                      :size="20"
                      :width="2"
                    />
                    <v-icon v-else>
                      mdi-key
                    </v-icon>
                  </template>
                  <v-list-item-title>Ver Token de {{ item.nome }}</v-list-item-title>
                </v-list-item>

                <v-list-item
                  v-if="$acl.can('update', 'Unidade')"
                  prepend-icon="mdi-pencil"
                  @click="editUnidade(item)"
                >
                  <v-list-item-title>Editar {{ item.nome }}</v-list-item-title>
                </v-list-item>

                <v-list-item
                  v-if="$acl.can('delete', 'Unidade')"
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
      @click:outside="hideTokenDialog()"
    >
      <v-card>
        <v-card-title>
          Token PagTesouro
        </v-card-title>
        <v-card-subtitle>
          {{ $store.getters['unidade/nome'] }}
        </v-card-subtitle>
        <v-card-text>
          {{ $store.getters['unidade/token'] }}
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="confirmDialog"
      max-width="400"
      @click:outside="closeDelete()"
    >
      <v-card>
        <v-card-title class="text-h5">
          Deletar a Unidade "{{ $store.getters['unidade/nome'] }}"?
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

<script>
  export default {
    name: 'Unidades',
    layout: 'admin',
    validate({ app }) {
      return app.$acl.can('read', 'Unidade');
    },
    data() {
      return {
        tokenDialog: false,
        tokenLoading: false,
        confirmDialog: false,
        busca: '',
        tableHeaders: [
          { text: 'Nome', value: 'nome' },
          { text: 'Slug', value: 'slug' },
          { text: 'Ações', value: 'actions', sortable: false, align: 'center', width: 80 },
        ],
      }
    },
    async fetch() {
      await this.$store.dispatch('fetchUnidades')
      .catch((error) => {
        this.$toast.error('Ocorreu um erro ao carregar as Unidades Gestoras: ' + error.message);
        console.error(error);
      });
    },
    head: {
      title: 'Lista de Unidades',
    },
    methods: {
      async showTokenDialog(item) {
        this.tokenLoading = item._id;

        this.$store.commit('unidade/replace', item);

        await this.$store.dispatch('unidade/fetchToken', item._id)
        .catch((error) => {
          this.$toast.error('Ocorreu um erro ao buscar o Token da Unidade Gestora: ' + error.message);
          console.error(error);
        });

        this.tokenDialog = true;

        this.tokenLoading = false;
      },
      hideTokenDialog() {
        this.$store.commit('unidade/clear');
        this.tokenDialog = false;
      },
      editUnidade(unidade) {
        this.$store.commit('unidade/replace', unidade);
        this.$router.push({
          path: '/admin/unidades/editar'
        });
      },
      confirmDelete(unidade) {
        this.$store.commit('unidade/replace', unidade);
        this.confirmDialog = true;
      },
      closeDelete() {
        this.$store.commit('unidade/clear');
        this.confirmDialog = false;
      },
      async deleteUnidade() {
        this.confirmDialog = false;
        await this.$store.dispatch('unidade/delete')
        .then(() => {
          this.$toast.success('Unidade Gestora removida com sucesso!');
        })
        .catch((error) => {
          console.error(error);
          this.$toast.error('Erro ao tentar deletar a Unidade Gestora. ' + error.message);
        });
      },
    },
  };
</script>
