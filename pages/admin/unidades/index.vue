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
                color="primary"
                to="/admin/unidades/nova"
              >
                <v-icon>mdi-plus</v-icon>
                Nova Unidade
              </v-btn>
            </v-toolbar>
          </template>
          <template v-slot:item.token="{ value }">
              <v-btn
                plain
                class="text-none sensitive"
                @click.prevent="toggleToken"
              >
                {{ value }}
              </v-btn>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                  small
                  class="mr-2"
                  @click="editUnidade(item)"
                >
                  mdi-pencil
                </v-icon>
              </template>
              <span> Editar {{ item.nome }} </span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                  small
                  @click="confirmDelete(item)"
                >
                  mdi-delete
                </v-icon>
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
      v-model="confirmDialog"
      max-width="400"
    >
      <v-card>
        <v-card-title class="text-h5">
          Deletar a Unidade "{{ $store.state.admin.unidade.nome }}"?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            text
            @click="confirmDialog = false"
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
        confirmDialog: false,
        busca: '',
        tableHeaders: [
          { text: 'Nome', value: 'nome' },
          { text: 'Slug', value: 'slug' },
          { text: 'Token', value: 'token', sortable: false },
          { text: 'Ações', value: 'actions', sortable: false, align: 'center', width: 100 },
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
      toggleToken(e) {
        let button = null;

        if (e.target.tagName === 'button') {
          button = e.target;
        } else {
          button = e.target.closest('button');
        }

        if (button) {
          button.classList.toggle('sensitive');
        }
      },
      editUnidade(unidade) {
        this.$store.commit('admin/setUnidade', unidade);
        this.$router.push({
          path: '/admin/unidades/editar'
        });
      },
      confirmDelete(unidade) {
        this.$store.commit('admin/setUnidade', unidade);
        this.confirmDialog = true;
      },
      async deleteUnidade() {
        this.confirmDialog = false;
        await this.$store.dispatch('admin/deleteUnidade')
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

<style lang="scss" scoped>
 .sensitive {
  filter: blur(5px);
 }
</style>
