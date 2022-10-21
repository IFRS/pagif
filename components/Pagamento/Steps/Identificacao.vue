<template>
  <v-container>
    <v-form ref="form" v-on="$listeners">
      <v-text-field
        prepend-icon="mdi-text-short"
        label="Nome"
        v-model="nomeContribuinte"
        :rules="validation.nome"
        :counter="45"
        required
      ></v-text-field>

      <v-text-field
        prepend-icon="mdi-card-account-details"
        label="CPF / CNPJ"
        v-model="cnpjCpf"
        :rules="validation.cnpjCpf"
      ></v-text-field>
    </v-form>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Identificacao',
  data() {
    return {
      validation: {
        nome: [
          v => !!v || 'O Nome do Contribuinte é obrigatório.',
          v => (v?.length >= 2 && v?.length <= 45) || 'Nome do Contribuinte precisa ter entre 2 e 45 caracteres.',
        ],
        cnpjCpf: [
          v => !v || (this.$validation.CPF(v) || this.$validation.CNPJ(v)) || 'CPF / CNPJ deve ser válido.',
        ],
      },
    }
  },
  computed: {
    nomeContribuinte: {
      ...mapGetters({ get: 'pagamento/nomeContribuinte' }),
      ...mapMutations({ set: 'pagamento/nomeContribuinte' }),
    },
    cnpjCpf: {
      ...mapGetters({ get: 'pagamento/cnpjCpf' }),
      ...mapMutations({ set: 'pagamento/cnpjCpf' }),
    },
  },
}
</script>
