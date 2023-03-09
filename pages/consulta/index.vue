<template>
  <v-container>
    <PageTitle>Consultar Pagamento para {{ $store.getters['config/unidade']?.nome }}</PageTitle>

    <v-form
      ref="form"
      lazy-validation
      @submit.prevent="submitConsulta"
    >
      <v-row dense>
        <v-col>
          <v-text-field
            v-model="idPagamento"
            label="Código do Pagamento"
            hint="Insira um código de pagamento em andamento."
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
  </v-container>
</template>

<script>
export default {
  name: 'Consulta',
  head: {
    title: 'Consulta Pagamento',
  },
  data() {
    return {
      idPagamento: null,
      validation: [],
    }
  },
  methods: {
    submitConsulta() {
      this.validation = [
        v => !!v || 'Código do Pagamento é obrigatório.',
        v => (/^[A-Za-z0-9]+$/).test(v) || 'Código do Pagamento só pode conter letras e números.',
      ];

      this.$nextTick(() => {
        if (this.$refs.form.validate()) {
          this.$router.push({ name: 'consulta-id', params: { id: this.idPagamento } });
        }
      });
    },
  },
}
</script>
