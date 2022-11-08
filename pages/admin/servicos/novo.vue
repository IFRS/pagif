<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Novo Servi&ccedil;o</h2>
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
    name: 'NovoServico',
    layout: 'admin',
    head: {
      title: 'Cadastro de Novo Serviço',
    },
    data() {
      return {
        submitting: false,
      }
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
    destroyed () {
      this.$store.commit('servico/clear');
    },
    validate({ app }) {
      return app.$acl.can('create', 'Servico');
    },
  }
</script>
