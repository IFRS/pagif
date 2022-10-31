<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Usu&aacute;rios</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :loading="$fetchState.pending"
          :headers="tableHeaders"
          :items="$store.getters['usuarios']"
          :items-per-page="10"
          :search="busca"
        >
          <template #top>
            <v-toolbar flat>
              <v-text-field
                v-model="busca"
                append-icon="mdi-magnify"
                label="Buscar Usuários"
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
                to="/admin/usuarios/novo"
              >
                <v-icon>mdi-plus</v-icon>
                Cadastrar Usu&aacute;rio
              </v-btn>
            </v-toolbar>
          </template>
          <template #item.actions="{ item }">
            <v-menu
              bottom
              left
              :offset-x="true"
              :close-on-content-click="false"
            >
              <template #activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  icon
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list dense>
                <v-list-item
                  @click="editUsuario(item)"
                >
                  <v-list-item-icon><v-icon>mdi-pencil</v-icon></v-list-item-icon>
                  <v-list-item-title>Editar {{ item.nome || item.email}}</v-list-item-title>
                </v-list-item>

                <v-list-item
                  @click.stop="confirmDelete(item)"
                >
                  <v-list-item-icon><v-icon>mdi-delete</v-icon></v-list-item-icon>
                  <v-list-item-title>Deletar {{ item.nome || item.email }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          <template slot="no-data">
            <v-alert
              dense
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
      @click:outside="closeDelete()"
    >
      <v-card>
        <v-card-title class="text-h5">
          Deletar o Usu&aacute;rio "{{ $store.getters['usuario/nome'] || $store.getters['usuario/email'] }}"?
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
            @click="deleteUsuario()"
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
    name: 'Usuários',
    layout: 'admin',
    head: {
      title: 'Lista de Usuários',
    },
    data() {
      return {
        confirmDialog: false,
        busca: '',
        tableHeaders: [
          { text: 'E-mail', value: 'email' },
          { text: 'Nome', value: 'nome' },
          { text: 'Ações', value: 'actions', sortable: false, align: 'center', width: 80 },
        ],
      }
    },
    async fetch() {
      await this.$store.dispatch('fetchUsuarios')
      .catch((error) => {
        this.$toast.error('Ocorreu um erro ao carregar os Usuários: ' + error.message);
        console.error(error);
      });
    },
    methods: {
      editUsuario(usuario) {
        this.$store.commit('usuario/replace', usuario);
        this.$router.push({
          path: '/admin/usuarios/editar'
        });
      },
      confirmDelete(usuario) {
        this.$store.commit('usuario/replace', usuario);
        this.confirmDialog = true;
      },
      closeDelete() {
        this.$store.commit('usuario/clear');
        this.confirmDialog = false;
      },
      async deleteUsuario() {
        this.confirmDialog = false;
        await this.$store.dispatch('usuario/delete')
        .then(() => {
          this.$toast.success('Usuário removido com sucesso!');
        })
        .catch((error) => {
          console.error(error);
          this.$toast.error('Erro ao tentar deletar o Usuário. ' + error.message);
        });
      },
    },
  };
</script>
