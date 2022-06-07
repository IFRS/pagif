<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Nova Unidade</h2>
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
        await this.$store.dispatch('unidades/save')
        .then(() => {
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
      handleCancel() {
        this.$store.commit('unidades/updateUnidade', {});
        this.$toast.info('Cadastro de Unidade cancelado.');
        this.$router.push({
          path: '/admin/unidades',
        });
      },
    },
  }
</script>
