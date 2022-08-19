<template>
  <v-container>
    <v-form ref="form" v-on="$listeners">
      <v-text-field
        label="CPF / CNPJ"
        v-model="cnpjCpf"
        :rules="validation"
      ></v-text-field>
    </v-form>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'CnpjCpf',
  data() {
    return {
      validation: [
        v => !v || (this.$validation.CPF(v) || this.$validation.CNPJ(v)) || 'CPF / CNPJ deve ser válido.',
      ],
    }
  },
  computed: {
    cnpjCpf: {
      ...mapGetters({ get: 'pagamento/cnpjCpf' }),
      ...mapMutations({ set: 'pagamento/cnpjCpf' }),
    },
  },
}
</script>
