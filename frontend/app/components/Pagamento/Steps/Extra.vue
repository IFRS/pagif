<template>
  <v-form
    ref="form"
    v-bind="$attrs"
    @submit.prevent
  >
    <p class="text-body-2 text--secondary mb-3">
      As informa&ccedil;&otilde;es abaixo s&atilde;o opcionais.
    </p>

    <v-text-field
      :key="codigoServico"
      v-model="referencia"
      prepend-icon="mdi-numeric"
      label="Número de Referência"
      :rules="validation.referencia"
      :counter="20"
      :required="isReferenciaRequired"
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
          hint="Selecione qualquer data dentro do mês desejado."
          persistent-hint
          prepend-icon="mdi-calendar-month"
          readonly
        />
      </template>
      <v-date-picker
        v-model="competencia"
        hide-header
      />
    </v-menu>
  </v-form>
</template>

<script setup>
import { watch } from 'vue'

const form = ref(null)
async function validateForm() {
  return await form.value.validate()
}
defineExpose({
  validateForm,
})

const validation = {
  referencia: [
    (v) => {
      if (isReferenciaRequired.value) {
        if (v) {
          return true
        }

        return 'O Número de Referência é obrigatório para o Serviço selecionado.'
      }

      return true
    },
    v => !v || (/^\d+$/).test(v) || 'Número de Referência precisa ser um número.',
    v => !v || v?.length <= 20 || 'Número de Referência deve ter no máximo 20 dígitos.',
  ],
}

const { codigoServico, referencia, competencia } = storeToRefs(usePagamentoStore())

const { servicos } = storeToRefs(useMainStore())

const isReferenciaRequired = ref(false)

onBeforeMount(() => {
  const servico = servicos.value.find(s => toRaw(s).codigo == codigoServico.value)
  isReferenciaRequired.value = servico?.referencia_required ?? false
})

const showCompetencia = ref(false)

const dayjs = utilDayJS()

const competenciaFormatted = computed(() => {
  if (!competencia.value) return null

  return dayjs(competencia.value).format('MM/YYYY')
})

watch(competencia, async () => {
  showCompetencia.value = false
})
</script>

<style lang="scss" scoped>
:deep(.dp__input_wrap) {
  box-sizing: border-box;
}
</style>
