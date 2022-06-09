<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Serviços</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :loading="$fetchState.pending"
          :headers="tableHeaders"
          :items="$store.state.admin.servicos"
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
                to="/admin/servicos/novo"
              >
                <v-icon>mdi-plus</v-icon>
                Novo Servi&ccedil;o
              </v-btn>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                  small
                  class="mr-2"
                  @click="editServico(item)"
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
          Deletar o Servi&ccedil;o "{{ $store.state.admin.servico.nome }}"?
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
    name: 'Servicos',
    layout: 'admin',
    data() {
      return {
        confirmDialog: false,
        busca: '',
        tableHeaders: [

        ],
      }
    },
    async fetch() {
      await this.$store.dispatch('admin/fetchServicos')
      .catch((error) => {
        this.$toast.error('Ocorreu um erro ao carregar os Serviços: ' + error.message);
        console.log(error);
      });
    },
    methods: {
      editServico(servico) {
        this.$store.commit('admin/setServico', servico);
        this.$router.push({
          path: '/admin/servicos/editar'
        });
      },
      confirmDelete(servico) {
        this.$store.commit('admin/setServico', servico);
        this.confirmDialog = true;
      },
      async deleteServico() {
        this.confirmDialog = false;
        await this.$store.dispatch('admin/deleteServico')
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
