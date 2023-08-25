<template>
  <v-form
    ref="form"
    v-bind="$attrs"
  >
    <v-text-field
      v-model="valorPrincipalFormatted"
      prepend-icon="mdi-currency-brl"
      label="Valor"
      hint="Valor total do pagamento."
      :rules="validation"
      required
      inputmode="numeric"
      maxlength="13"
    />
  </v-form>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { usePagamentoStore } from '~/store/pagamento';

const form = ref(null)
async function validateForm() {
  return await form.value.validate()
}
defineExpose({
  validateForm,
})

const validation = [
  v => !!v || 'Valor é obrigatório.',
]

const { valorPrincipal } = storeToRefs(usePagamentoStore())

const valorPrincipalFormatted = computed({
  get() {
    if (valorPrincipal.value) {
      let value = String(valorPrincipal.value)
      value = value.replace(/\D/g, '')
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumIntegerDigits: 1, minimumFractionDigits: 2 }).format(
        parseInt(value) / 100
      )
    }
    return ''
  },
  set(value) {
    value = String(value)
    value = value.replace(/\D/g, '')
    value = value.substring(value.length - 8)
    value = parseInt(value)
    valorPrincipal.value = value
  }
})
</script>
