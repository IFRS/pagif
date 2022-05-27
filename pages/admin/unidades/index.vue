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
          :headers="tableHeaders"
          :items="unidades"
          :items-per-page="10"
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
      await this.$axios.get('/api/unidades')
      .then((response) => {
        this.unidades = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    },
  };
</script>
