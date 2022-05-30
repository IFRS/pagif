<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Unidades</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          v-model="busca"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
        <v-data-table
          :loading="tableLoading"
          :headers="tableHeaders"
          :items="unidades"
          :items-per-page="10"
          :search="busca"
        ></v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-fab-transition>
          <v-btn
            v-show="!hidden"
            color="primary"
            fab
            absolute
            bottom
            right
            to="/admin/unidades/nova"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-fab-transition>
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
        hidden: true,
      }
    },
    mounted() {
      this.hidden = false;
    },
    async fetch() {
      this.tableLoading = true;

      await this.$axios.get('/api/unidades')
      .then((response) => {
        this.unidades = response.data;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.tableLoading = false;
      });
    },
  };
</script>
