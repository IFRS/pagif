<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Unidades Gestoras</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :loading="$fetchState.pending"
          :headers="tableHeaders"
          :items="$store.state.admin.unidades"
          :items-per-page="10"
          :search="busca"
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
                to="/admin/unidades/nova"
              >
                <v-icon>mdi-plus</v-icon>
                Nova Unidade
              </v-btn>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="showTokenDialog(item)"
                >
                  <v-icon>mdi-key</v-icon>
                </v-btn>
              </template>
              <span> Ver Token de {{ item.nome }} </span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="editUnidade(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span> Editar {{ item.nome }} </span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="confirmDelete(item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span> Deletar {{ item.nome }} </span>
            </v-tooltip>
          </template>
          <template slot="no-data">
            <v-alert
              dense
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
          {{ $store.getters['admin/unidade/nome'] }}
        </v-card-subtitle>
        <v-card-text>
          {{ $store.getters['admin/unidade/token'] }}
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
          Deletar a Unidade "{{ $store.getters['admin/unidade/nome'] }}"?
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
    data() {
      return {
        tokenDialog: false,
        confirmDialog: false,
        busca: '',
        tableHeaders: [
          { text: 'Nome', value: 'nome' },
          { text: 'Slug', value: 'slug' },
          { text: 'Ações', value: 'actions', sortable: false, align: 'center', width: 150 },
        ],
      }
    },
    async fetch() {
      await this.$store.dispatch('admin/fetchUnidades')
      .catch((error) => {
        this.$toast.error('Ocorreu um erro ao carregar as Unidades Gestoras: ' + error.message);
        console.log(error);
      });
    },
    methods: {
      showTokenDialog(item) {
        this.$store.commit('admin/unidade/replace', item);
        this.tokenDialog = true;
      },
      hideTokenDialog() {
        this.$store.commit('admin/unidade/clear');
        this.tokenDialog = false;
      },
      editUnidade(unidade) {
        this.$store.commit('admin/unidade/replace', unidade);
        this.$router.push({
          path: '/admin/unidades/editar'
        });
      },
      confirmDelete(unidade) {
        this.$store.commit('admin/unidade/replace', unidade);
        this.confirmDialog = true;
      },
      closeDelete() {
        this.$store.commit('admin/unidade/clear');
        this.confirmDialog = false;
      },
      async deleteUnidade() {
        this.confirmDialog = false;
        await this.$store.dispatch('admin/unidade/delete')
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
