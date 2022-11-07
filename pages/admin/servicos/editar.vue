<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Editar Servi&ccedil;o "{{ this.$store.getters['servico/nome'] }}"</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <FormServico @ok="handleSubmit" @cancel="handleCancel" :submitting="submitting"></FormServico>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'EditarServico',
    layout: 'admin',
    head: {
      title: 'Edição de Serviço',
    },
    data() {
      return {
        submitting: false,
      }
    },
    methods: {
      async handleSubmit() {
        this.submitting = true,
        await this.$store.dispatch('servico/update')
        .then(() => {
          this.$toast.success('Serviço atualizado com sucesso!');
          this.$router.push({
            path: '/admin/servicos',
          });
        })
        .catch((error) => {
          this.$toast.error('Ocorreu um erro ao atualizar o Serviço. ' + error.message);
          console.error(error);
        })
        .finally(() => {
          this.submitting = false;
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
      this.$store.commit('servico/clear');
    },
    // validate({ store }) {
    //   return store.getters['auth/userHasRole'](ROLES.ADMIN.role);
    // },
  }
</script>
