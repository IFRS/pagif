<template>
  <v-form
    ref="form"
    v-bind="$attrs"
  >
    <v-text-field
      v-model="nomeContribuinte"
      prepend-icon="mdi-text-short"
      label="Nome Completo"
      :rules="validation.nome"
      :counter="45"
      required
      class="required"
    />

    <v-text-field
      v-model="cnpjCpfFormatted"
      v-mask="cnpjCpfMask"
      prepend-icon="mdi-card-account-details"
      label="CPF / CNPJ"
      :rules="validation.cnpjCpf"
      validate-on="blur"
      required
      class="required"
    />
  </v-form>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      validation: {
        nome: [
          v => !!v || 'O Nome do Contribuinte é obrigatório.',
          v => (v?.length >= 2 && v?.length <= 45) || 'Nome do Contribuinte precisa ter entre 2 e 45 caracteres.',
        ],
        cnpjCpf: [
          v => !!v || 'CPF / CNPJ é obrigatório.',
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
    cnpjCpfFormatted: {
      get() {
        if (this.cnpjCpf) return this.$options.filters.VMask(this.cnpjCpf, this.cnpjCpfMask);
        return '';
      },
      set(value) {
        value = String(value);
        value = value.replace(/\D/g, '');
        this.cnpjCpf = value;
      }
    },
    cnpjCpfMask() {
      if (this.cnpjCpf && this.cnpjCpf.length > 11) {
        return '##.###.###/####-##';
      }
      return '###.###.###-##';
    },
  },
}
</script>
