<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Nova Unidade</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <FormUnidade @salvar="handleSubmit"></FormUnidade>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'NovaUnidade',
    layout: 'admin',
    methods: {
      async handleSubmit(unidade) {
        await this.$axios.post('/api/unidades', unidade)
        .then((response) => {
          this.$toast.success('Unidade cadastrada com sucesso!');
          this.$router.push({
            path: '/admin/unidades',
          });
        })
        .catch((error) => {
          this.$toast.error('Ocorreu um erro ao cadastrar a Unidade. ' + error.message);
          console.error(error);
        });
      },
    },
  }
</script>
