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
      prepend-icon="mdi-card-account-details"
      label="CPF / CNPJ"
      :rules="validation.cnpjCpf"
      validate-on="blur"
      required
      class="required"
    />
  </v-form>
</template>

<script setup>
import { Mask } from "maska"
import { useNuxtApp } from '#app'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { usePagamentoStore } from '~/store/pagamento'

const form = ref(null)
async function validateForm() {
  return await form.value.validate()
}
defineExpose({
  validateForm,
})

const { $isCPF, $isCNPJ } = useNuxtApp()

const validation = {
  nome: [
    v => !!v || 'O Nome do Contribuinte é obrigatório.',
    v => (v?.length >= 2 && v?.length <= 45) || 'Nome do Contribuinte precisa ter entre 2 e 45 caracteres.',
  ],
  cnpjCpf: [
    v => !!v || 'CPF / CNPJ é obrigatório.',
    v => v && ($isCPF(v) || $isCNPJ(v)) || 'CPF / CNPJ deve ser válido.',
  ],
}

const { nomeContribuinte, cnpjCpf } = storeToRefs(usePagamentoStore())

const cnpjCpfFormatted = computed({
  get() {
    if (cnpjCpf.value) {
      const mask = new Mask({ mask: cnpjCpfMask.value })
      return mask.masked(cnpjCpf.value);
    }
    return '';
  },
  set(value) {
    value = String(value);
    value = value.replace(/\D/g, '');
    cnpjCpf.value = value;
  }
})

const cnpjCpfMask = computed(() => {
  if (cnpjCpf.value && cnpjCpf.value.length > 11) {
    return '##.###.###/####-##';
  }
  return '###.###.###-##';
})
</script>
