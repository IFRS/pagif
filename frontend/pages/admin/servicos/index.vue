<template>
  <v-container>
    <v-row>
      <v-col>
        <PageTitle>Serviços</PageTitle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- eslint-disable-next-line vuetify/no-deprecated-components -->
        <v-data-table
          :loading="$fetchState.pending"
          :headers="tableHeaders"
          :items="$store.getters['servicos']"
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
                v-if="$acl.can('create', 'Servico')"
                color="primary"
                to="/admin/servicos/novo"
              >
                <v-icon>mdi-plus</v-icon>
                Novo Servi&ccedil;o
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
                  :disabled="$acl.cannot('update', 'Servico') || $acl.cannot('delete', 'Servico')"
                  v-on="on"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list density="compact">
                <v-list-item
                  v-if="$acl.can('update', 'Servico')"
                  prepend-icon="mdi-pencil"
                  @click="editServico(item)"
                >
                  <v-list-item-title>Editar {{ item.nome }}</v-list-item-title>
                </v-list-item>

                <v-list-item
                  v-if="$acl.can('delete', 'Servico')"
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
      @click:outside="closeDelete()"
    >
      <v-card>
        <v-card-title class="text-h5">
          Deletar o Servi&ccedil;o "{{ $store.getters['servico/nome'] }}"?
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

<script>
  export default {
    components: {
      vDataTable,
    },
    layout: 'admin',
    validate({ app }) {
      return app.$acl.can('read', 'Servico');
    },
    data() {
      return {
        confirmDialog: false,
        busca: '',
        tableHeaders: [
          { text: 'Unidade', value: 'unidade.nome' },
          { text: 'Código', value: 'codigo' },
          { text: 'Nome', value: 'nome' },
          { text: 'Ações', value: 'actions', sortable: false, align: 'center', width: 80 },
        ],
      }
    },
    async fetch() {
      await this.$store.dispatch('fetchServicos')
      .catch((error) => {
        this.$toast.error('Ocorreu um erro ao carregar os Serviços: ' + error.message);
        console.error(error);
      });
    },
    head: {
      title: 'Lista de Serviços',
    },
    methods: {
      editServico(servico) {
        this.$store.commit('servico/replace', servico);
        this.$router.push({
          path: '/admin/servicos/editar'
        });
      },
      confirmDelete(servico) {
        this.$store.commit('servico/replace', servico);
        this.confirmDialog = true;
      },
      closeDelete() {
        this.$store.commit('servico/clear');
        this.confirmDialog = false;
      },
      async deleteServico() {
        this.confirmDialog = false;
        await this.$store.dispatch('servico/delete')
        .then(() => {
          this.$toast.success('Serviço removido com sucesso!');
        })
        .catch((error) => {
          console.error(error);
          this.$toast.error('Erro ao tentar deletar o Serviço. ' + error.message);
        });
      },
    },
  };
</script>
