<template>
  <FormPagamento @enviar="handlePagamento"></FormPagamento>
</template>

<script>
  export default {
    name: 'Pagar',
    data() {
      return {
        pagamento: null,
      }
    },
    methods: {
      async handlePagamento(pagamento) {
        this.pagamento = pagamento;
        await this.$axios.post('/api/pagar', { ...this.pagamento })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
      },
    },
  };
</script>
