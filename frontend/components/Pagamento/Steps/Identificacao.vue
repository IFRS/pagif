<template>
  <v-form
    ref="form"
    v-bind="$attrs"
    @submit.prevent
  >
    <v-text-field
      v-model="nomeContribuinte"
      prepend-icon="mdi-text-short"
      label="Nome Completo"
      :rules="validation.nome"
      :counter="45"
      required
    />

    <v-text-field
      v-model="cnpjCpfFormatted"
      prepend-icon="mdi-card-account-details"
      label="CPF / CNPJ"
      :rules="validation.cnpjCpf"
      validate-on="blur"
      inputmode="numeric"
      required
    />
  </v-form>
</template>

<script setup>
import { useNuxtApp } from '#app'

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
    v => (v && ($isCPF(v) || $isCNPJ(v))) || 'CPF / CNPJ deve ser válido.',
  ],
}

const { nomeContribuinte, cnpjCpf } = storeToRefs(usePagamentoStore())

const cnpjCpfFormatted = computed(useComputedMaskedCnpjCpf(cnpjCpf))
</script>
