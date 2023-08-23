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
      v-model="showCompetencia"
      :close-on-content-click="false"
      transition="scale-transition"
      max-width="auto"
      min-width="auto"
    >
      <template #activator="{ props }">
        <v-text-field
          v-model="competenciaFormatted"
          v-bind="props"
          label="Competência"
          prepend-icon="mdi-calendar-month"
          readonly
        />
      </template>
      <v-date-picker
        v-model="competencia"
        show-adjacent-months
        @click:cancel="showCompetencia = false"
        @click:save="showCompetencia = false"
      >
        <template #header />
      </v-date-picker>
    </v-menu>
  </v-form>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { usePagamentoStore } from '~/store/pagamento'

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

const showCompetencia = ref(false)

const { referencia, competencia } = storeToRefs(usePagamentoStore())

const dayjs = useDayjs()

const competenciaFormatted = computed(() => {
  if (!competencia.value) return null

  return dayjs(competencia.value).format('MM/YYYY')
})
</script>

<style lang="scss" scoped>
:deep(.dp__input_wrap) {
  box-sizing: border-box;
}
</style>
