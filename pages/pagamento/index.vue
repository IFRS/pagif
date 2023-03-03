<template>
  <v-container>
    <PageTitle>Pagamento para {{ $store.getters['config/unidade']?.nome }}</PageTitle>

    <h3 class="mb-4 text-center">J&aacute; tenho o c&oacute;digo para Pagamento</h3>
    <v-form
      class="mb-8"
      ref="form"
      lazy-validation
      @submit.prevent="submitPagamento"
    >
      <v-row dense>
        <v-col>
          <v-text-field
            v-model="idPagamento"
            label="Código do Pagamento"
            hint="Insira um código de pagamento já cadastrado."
            clearable
            filled
            :rules="validation"
            required
            class="required"
          ></v-text-field>
        </v-col>
        <v-col cols="auto">
          <v-btn
            type="submit"
            icon
            x-large
          >
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <div class="text-center">
      <h3 class="mb-4">ou, realizar um pagamento manualmente</h3>
      <v-btn
        class="mx-auto"
        x-large
        color="primary"
        :to="{ name: 'pagamento-novo' }"
      >
        Novo Pagamento
      </v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'Pagamento',
  head: {
    title: 'Pagamento',
  },
  data() {
    return {
      idPagamento: null,
      validation: [],
    }
  },
  methods: {
    submitPagamento() {
      this.validation = [
        v => !!v || 'Código do Pagamento é obrigatório.',
        v => (/^[A-Za-z0-9]+$/).test(v) || 'Código do Pagamento só pode conter letras e números.',
      ];

      this.$nextTick(() => {
        if (this.$refs.form.validate()) {
          this.$router.push({ name: 'pagamento-id', params: { id: this.idPagamento } });
        }
      });
    },
  },
}
</script>
