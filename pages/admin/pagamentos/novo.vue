<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Nova Cobran&ccedil;a</h2>
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
    name: 'NovaCobranca',
    layout: 'admin',
    data() {
      return {
        submitting: false,
      }
    },
    methods: {
      async handleSubmit() {
        this.submitting = true;
        await this.$store.dispatch('admin/savePagamento')
        .then(() => {
          this.$toast.success('Cobrança cadastrada com sucesso!');
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
      this.$store.commit('admin/setPagamento', {});
    },
  }
</script>
