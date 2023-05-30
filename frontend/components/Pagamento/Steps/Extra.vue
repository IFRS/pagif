<template>
  <v-form
    ref="form"
    v-bind="$attrs"
  >
    <p class="text-body-2 text--secondary mb-3">
      As informa&ccedil;&otilde;es abaixo s&atilde;o opcionais.
    </p>

    <v-text-field
      v-model="referencia"
      prepend-icon="mdi-numeric"
      label="Número de Referência"
      :rules="validation.referencia"
      :counter="20"
    />

    <v-menu
      :persistent="!(true)"
      :close-on-content-click="true"
      :model-value="competencia"
      transition="scale-transition"
      max-width="auto"
      min-width="auto"
    >
      <template #activator="{ props }">
        <v-text-field
          v-model="competenciaFormatted"
          label="Competência"
          prepend-icon="mdi-calendar-month"
          readonly
          v-bind="props"
        />
      </template>
      <!-- TODO substituir componente -->
      <span>Date Picker</span>
      <!-- <v-date-picker
        v-model="competencia"
        type="month"
        no-title
        scrollable
      /> -->
    </v-menu>
  </v-form>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { usePagamentoStore } from '~/store/pagamento'
import dayjs from 'dayjs'

const form = ref(null)
async function validateForm() {
  return await form.value.validate()
}
defineExpose({
  validateForm,
})

const validation = {
  referencia: [
    v => !v || (/^\d+$/).test(v) || 'Número de Referência precisa ser um número.',
    v => !v || v?.length <= 20 || 'Número de Referência deve ter no máximo 20 dígitos.',
  ],
}

const { referencia, competencia } = storeToRefs(usePagamentoStore())

const competenciaFormatted = computed(() => {
  if (!competencia) return null;

  return dayjs(competencia).format('MM/YYYY');
})
</script>
