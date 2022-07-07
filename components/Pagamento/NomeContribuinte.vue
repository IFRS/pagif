<template>
  <v-container>
    <v-form ref="form" v-on="$listeners">
      <v-text-field
        label="Nome"
        v-model="nomeContribuinte"
        :rules="validation"
        :counter="45"
        required
      ></v-text-field>
    </v-form>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'PagamentoNomeContribuinte',
  data() {
    return {
      validation: [
        v => !!v || 'O Nome do Contribuinte é obrigatório.',
        v => (v?.length >= 2 && v?.length <= 45) || 'Nome do Contribuinte precisa ter entre 2 e 45 caracteres.',
      ],
    }
  },
  computed: {
    nomeContribuinte: {
      ...mapGetters({ get: 'pagamento/nomeContribuinte' }),
      ...mapMutations({ set: 'pagamento/nomeContribuinte' }),
    },
  },
}
</script>
