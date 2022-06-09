<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Novo Serviço</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <FormServico @ok="handleSubmit" @cancel="handleCancel"></FormServico>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'NovoServico',
    layout: 'admin',
    methods: {
      async handleSubmit() {
        await this.$store.dispatch('admin/saveServico')
        .then(() => {
          this.$toast.success('Serviço cadastrado com sucesso!');
          this.$router.push({
            path: '/admin/servicos',
          });
        })
        .catch((error) => {
          this.$toast.error('Ocorreu um erro ao cadastrar o Serviço. ' + error.message);
          console.error(error);
        });
      },
      handleCancel() {
        this.$toast.info('Cadastro de Serviço cancelado.');
        this.$router.push({
          path: '/admin/servicos',
        });
      },
    },
    destroyed () {
      this.$store.commit('admin/setServico', {});
    },
  }
</script>
