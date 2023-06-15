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

    <VueDatePicker
      v-model="competencia"
      model-type="yyyy-MM"
      locale="pt-BR"
      month-picker
      auto-apply
      :teleport="true"
      placeholder="Selecione um mês"
      text-input
    >
      <template #dp-input="{ value, onInput, onEnter, onTab, onClear, onBlur, onKeypress, isMenuOpen }">
        <v-text-field
          prepend-icon="mdi-calendar-month"
          label="Compentência"
          hide-details
          readonly
          :active="isMenuOpen"
          :model-value="value"
          @update:model-value="onInput"
          @keydown.enter="onEnter"
          @keydown.tab="onTab"
          @blur="onBlur"
          @keydown="onKeypress"
          @click:clear="onClear"
        />
      </template>
    </VueDatePicker>
  </v-form>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { usePagamentoStore } from '~/store/pagamento'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

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
</script>

<style lang="scss" scoped>
:deep(.dp__input_wrap) {
  box-sizing: border-box;
}
</style>
