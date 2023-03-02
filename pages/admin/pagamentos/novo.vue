<template>
  <v-container>
    <v-row>
      <v-col>
        <PageTitle>Nova Cobran&ccedil;a</PageTitle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <FormPagamento @ok="handleSubmit" @cancel="handleCancel" :submitting="submitting"></FormPagamento>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'NovoPagamento',
    layout: 'admin',
    head: {
      title: 'Nova Cobrança',
    },
    data() {
      return {
        submitting: false,
      }
    },
    methods: {
      async handleSubmit() {
        this.submitting = true;
        await this.$store.dispatch('pagamento/save')
        .then(() => {
          this.$toast.success('Cobrança cadastrada com sucesso!');
          this.$store.commit('pagamento/clear');
          this.$router.push({
            path: '/admin/pagamentos',
          });
        })
        .catch((error) => {
          this.$toast.error('Ocorreu um erro ao cadastrar a Cobrança. ' + error.message);
          console.error(error);
        })
        .finally(() => {
          this.submitting = false;
        });
      },
      handleCancel() {
        this.$toast.info('Cadastro de Cobrança cancelado.');
        this.$router.push({
          path: '/admin/pagamentos',
        });
      },
    },
    destroyed () {
      this.$store.commit('pagamento/clear');
    },
    validate({ app }) {
      return app.$acl.can('create', 'Pagamento');
    },
  }
</script>
