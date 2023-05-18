<template>
  <v-form
    ref="form"
    v-on="$listeners"
  >
    <v-currency-field
      v-model="valorPrincipal"
      prepend-icon="mdi-currency-brl"
      label="Valor"
      hint="Valor total do pagamento."
      :rules="validation"
      required
      class="required"
    />
  </v-form>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'ValorPrincipal',
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
