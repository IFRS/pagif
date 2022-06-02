<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Unidades</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :loading="tableLoading"
          :headers="tableHeaders"
          :items="unidades"
          :items-per-page="10"
          :search="busca"
        >
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>Unidades</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
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
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'Pagamentos',
    layout: 'admin',
    data() {
      return {
        busca: '',
        tableLoading: false,
        tableHeaders: [
          { text: 'Nome', value: 'nome' },
          { text: 'Slug', value: 'slug' },
          { text: 'Token', value: 'token', sortable: false },
        ],
        unidades: [],
      }
    },
    async fetch() {
      this.tableLoading = true;

      await this.$axios.get('/api/unidades')
      .then((response) => {
        this.unidades = response.data;
      })
      .catch((error) => {
        this.$toast.error('Ocorreu um erro ao carregar as Unidades: ' + error.message);
        console.log(error);
      })
      .finally(() => {
        this.tableLoading = false;
      });
    },
  };
</script>
