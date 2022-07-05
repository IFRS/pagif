<template>
  <v-container>
    <v-form ref="form">
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
  name: 'PagamentoCnpjCpf',
  data() {
    return {
      validation: [
        v => !v || (this.validaCPF(v) || this.validaCNPJ(v)) || 'CPF / CNPJ deve ser válido.',
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
