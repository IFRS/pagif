<template>
  <v-form
    ref="form"
    v-bind="$attrs"
    @submit.prevent
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

const valorPrincipalFormatted = computed(useComputedMaskedCurrency(valorPrincipal))
</script>
