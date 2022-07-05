<template>
  <v-form ref="form" @submit.prevent>
    <v-currency-field
      prepend-icon="mdi-currency-brl"
      label="Valor"
      hint="Valor total do pagamento."
      v-model="valorPrincipal"
      :rules="validation"
      required
    ></v-currency-field>
  </v-form>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'PagamentoValorPrincipal',
  data() {
    return {
      validation: [
        v => !!v || 'Valor é obrigatório.',
      ],
    }
  },
  computed: {
    valorPrincipal: {
      ...mapGetters({ get: 'pagamento/valorPrincipal' }),
      ...mapMutations({ set: 'pagamento/valorPrincipal' }),
    },
  },
}
</script>
