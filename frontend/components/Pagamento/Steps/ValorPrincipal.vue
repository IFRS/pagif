<template>
  <v-form
    ref="form"
    v-bind="$attrs"
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

<script setup>
import { storeToRefs } from 'pinia';
import { usePagamentoStore } from '~/store/pagamento';

const validation = [
  v => !!v || 'Valor é obrigatório.',
]

const { valorPrincipal } = storeToRefs(usePagamentoStore())
</script>
