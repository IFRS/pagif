<template>
  <v-container>
    <v-row>
      <v-col>
        <PageTitle>Nova Cobran&ccedil;a</PageTitle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <FormPagamento
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
    name: 'NovoPagamento',
    layout: 'admin',
    validate({ app }) {
      return app.$acl.can('create', 'Pagamento');
    },
    data() {
      return {
        submitting: false,
      }
    },
    head: {
      title: 'Nova Cobrança',
    },
    unmounted () {
      this.$store.commit('pagamento/clear');
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
  }
</script>
