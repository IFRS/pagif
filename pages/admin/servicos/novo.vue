<template>
  <v-container>
    <v-row>
      <v-col>
        <PageTitle>Novo Servi&ccedil;o</PageTitle>
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
    name: 'NovoServico',
    layout: 'admin',
    validate({ app }) {
      return app.$acl.can('create', 'Servico');
    },
    data() {
      return {
        submitting: false,
      }
    },
    head: {
      title: 'Cadastro de Novo Serviço',
    },
    unmounted () {
      this.$store.commit('servico/clear');
    },
    methods: {
      async handleSubmit() {
        this.submitting = true;
        await this.$store.dispatch('servico/save')
        .then(() => {
          this.$toast.success('Serviço cadastrado com sucesso!');
          this.$router.push({
            path: '/admin/servicos',
          });
        })
        .catch((error) => {
          this.$toast.error('Ocorreu um erro ao cadastrar o Serviço. ' + error.message);
          console.error(error);
        })
        .finally(() => {
          this.submitting = false;
        });
      },
      handleCancel() {
        this.$toast.info('Cadastro de Serviço cancelado.');
        this.$router.push({
          path: '/admin/servicos',
        });
      },
    },
  }
</script>
