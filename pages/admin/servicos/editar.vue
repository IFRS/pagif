<template>
  <v-container>
    <v-row>
      <v-col>
        <PageTitle>Editar Servi&ccedil;o "{{ $store.getters['servico/nome'] }}"</PageTitle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <FormServico
          :submitting="submitting"
          @ok="handleSubmit"
          @cancel="handleCancel"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'EditarServico',
    layout: 'admin',
    validate({ app }) {
      return app.$acl.can('update', 'Servico');
    },
    data() {
      return {
        submitting: false,
      }
    },
    head: {
      title: 'Edição de Serviço',
    },
    unmounted () {
      this.$store.commit('servico/clear');
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
  }
</script>
