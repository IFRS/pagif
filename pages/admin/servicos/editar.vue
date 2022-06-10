<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Editar Serviço "{{ this.$store.state.admin.servico.nome }}"</h2>
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
    name: 'EditarServico',
    layout: 'admin',
    methods: {
      async handleSubmit() {
        await this.$store.dispatch('admin/updateServico')
        .then(() => {
          this.$toast.success('Serviço atualizado com sucesso!');
          this.$router.push({
            path: '/admin/servicos',
          });
        })
        .catch((error) => {
          this.$toast.error('Ocorreu um erro ao atualizar o Serviço. ' + error.message);
          console.error(error);
        });
      },
      handleCancel() {
        this.$toast.info('Edição do Serviço cancelada.');
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
