<template>
  <v-container>
    <h2>Pagamento para {{ $store.getters['unidade/nome'] }}</h2>

    <h3 class="mb-4 text-center">J&aacute; tenho um c&oacute;digo para Pagamento</h3>
    <v-form
      class="mb-8"
      ref="form"
      lazy-validation
      @submit.prevent="submitPagamento"
    >
      <v-text-field
        v-model="idPagamento"
        label="Código do Pagamento"
        hint="Insira o código de pagamento já cadastrado."
        clearable
        filled
        :rules="validation"
        required
      >
        <template v-slot:append-outer>
          <v-btn
            x-large
            type="submit"
            icon
          >
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </v-form>

    <div class="text-center">
      <h3 class="mb-4">Realizar um pagamento manualmente</h3>
      <v-btn
        class="mx-auto"
        x-large
        :to="{ name: 'novo-pagamento' }"
      >
        Novo Pagamento
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Pagamento',
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
          this.$router.push({ name: 'pagar-id', params: { id: this.idPagamento } })
        }
      });
    },
  },
}
</script>
