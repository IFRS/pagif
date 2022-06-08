<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Nova Unidade Gestora</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <FormUnidade @ok="handleSubmit" @cancel="handleCancel"></FormUnidade>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'NovaUnidade',
    layout: 'admin',
    methods: {
      async handleSubmit() {
        await this.$store.dispatch('admin/saveUnidade')
        .then(() => {
          this.$toast.success('Unidade Gestora cadastrada com sucesso!');
          this.$router.push({
            path: '/admin/unidades',
          });
        })
        .catch((error) => {
          this.$toast.error('Ocorreu um erro ao cadastrar a Unidade Gestora. ' + error.message);
          console.error(error);
        });
      },
      handleCancel() {
        this.$toast.info('Cadastro de Unidade Gestora cancelado.');
        this.$router.push({
          path: '/admin/unidades',
        });
      },
    },
    destroyed () {
      this.$store.commit('admin/setUnidade', {});
    },
  }
</script>
