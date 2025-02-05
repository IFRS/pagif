<template>
  <v-form
    ref="formNode"
    @submit.prevent="handleSubmit"
  >
    <v-container>
      <v-row>
        <v-col>
          <!-- Unidade -->
          <v-autocomplete
            prepend-icon="mdi-office-building-marker"
            label="Unidade Gestora"
            :rules="validation.unidade"
            :loading="pending"
            :disabled="pending"
            :items="unidades"
            item-title="nome"
            item-value="_id"
            required
            @update:model-value="fetchServicos"
          />
        </v-col>
        <v-col>
          <!-- Código do Serviço -->
          <v-autocomplete
            v-model="codigoServico"
            prepend-icon="mdi-basket"
            label="Serviço"
            validate-on="blur"
            :rules="validation.codigoServico"
            :loading="loadingServicos"
            :disabled="loadingServicos || servicos.length === 0"
            :items="servicos"
            item-title="nome"
            item-value="codigo"
            required
          >
            <template #item="{ props, item }">
              <v-list-item
                v-bind="props"
                :title="item.raw.codigo + ' - ' + item.raw.nome"
              />
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <!-- Referência -->
          <v-text-field
            :key="codigoServico"
            v-model="referencia"
            prepend-icon="mdi-numeric"
            label="Número de Referência"
            :rules="validation.referencia"
            :counter="20"
            :required="isReferenciaRequired"
          />
        </v-col>
        <v-col>
          <!-- Competência -->
          <v-menu
            v-model="showCompetencia"
            :close-on-content-click="false"
            transition="scale-transition"
            max-width="auto"
            min-width="auto"
          >
            <template #activator="{ props }">
              <v-text-field
                :model-value="competenciaFormatted"
                v-bind="props"
                label="Competência"
                prepend-icon="mdi-calendar-month"
                readonly
                clearable
                @click:clear="competencia = null"
              />
            </template>
            <v-date-picker
              v-model="competencia"
              hide-header
            />
          </v-menu>
        </v-col>
        <v-col>
          <!-- Vencimento -->
          <v-menu
            v-model="showVencimento"
            :close-on-content-click="false"
            transition="scale-transition"
            max-width="auto"
            min-width="auto"
          >
            <template #activator="{ props }">
              <v-text-field
                :model-value="vencimentoFormatted"
                v-bind="props"
                :rules="validation.vencimento"
                label="Vencimento"
                prepend-icon="mdi-calendar"
                readonly
                clearable
                @click:clear="vencimento = null"
              />
            </template>
            <v-date-picker
              v-model="vencimento"
              show-adjacent-months
              hide-header
            />
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <!-- Nome do Contribuinte -->
          <v-text-field
            v-model="nomeContribuinte"
            prepend-icon="mdi-text-short"
            label="Nome do Contribuinte"
            :rules="validation.nomeContribuinte"
            :counter="45"
            required
          />
        </v-col>
        <v-col>
          <!-- CPF / CNPJ -->
          <v-text-field
            v-model="cnpjCpfFormatted"
            prepend-icon="mdi-card-account-details"
            label="CPF / CNPJ"
            :rules="validation.cnpjCpf"
            validate-on="blur"
            required
          />
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col>
          <!-- Valor Principal -->
          <v-text-field
            v-model="valorPrincipalFormatted"
            prepend-icon="mdi-currency-brl"
            label="Valor Principal"
            hint="Valor do pagamento."
            :rules="validation.valorPrincipal"
            required
          />
        </v-col>
        <v-icon size="small">
          mdi-minus
        </v-icon>
        <v-col>
          <!-- Valor Descontos -->
          <v-text-field
            v-model="valorDescontosFormatted"
            prepend-icon="mdi-currency-brl"
            label="Valor Descontos"
            hint="Valor dos descontos."
          />
        </v-col>
        <v-icon size="small">
          mdi-minus
        </v-icon>
        <v-col>
          <!-- Valor Deduções -->
          <v-text-field
            v-model="valorOutrasDeducoesFormatted"
            prepend-icon="mdi-currency-brl"
            label="Valor Deduções"
            hint="Valor de outras deduções."
          />
        </v-col>
        <v-icon size="small">
          mdi-plus
        </v-icon>
        <v-col>
          <!-- Valor Multa -->
          <v-text-field
            v-model="valorMultaFormatted"
            prepend-icon="mdi-currency-brl"
            label="Valor Multa"
            hint="Valor da multa."
          />
        </v-col>
        <v-icon size="small">
          mdi-plus
        </v-icon>
        <v-col>
          <!-- Valor Juros -->
          <v-text-field
            v-model="valorJurosFormatted"
            prepend-icon="mdi-currency-brl"
            label="Valor Juros"
            hint="Valor dos juros."
          />
        </v-col>
        <v-icon size="small">
          mdi-plus
        </v-icon>
        <v-col>
          <!-- Valor Acréscimos -->
          <v-text-field
            v-model="valorOutrosAcrescimosFormatted"
            prepend-icon="mdi-currency-brl"
            label="Valor Acréscimos"
            hint="Valor de outros acréscimos."
          />
        </v-col>
      </v-row>
      <v-row
        justify="start"
        dense
      >
        <v-col cols="auto">
          <v-btn
            color="primary"
            type="submit"
            :loading="submitting"
            :disabled="submitting"
          >
            Salvar
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn
            color="secondary"
            :disabled="submitting"
            @click="handleCancel()"
          >
            Cancelar
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup>
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

const dayjs = utilDayJS(customParseFormat, isSameOrAfter)

defineProps({
  submitting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['ok', 'cancel'])

const formNode = ref(null)

const { $isCPF, $isCNPJ } = useNuxtApp()

const validation = {
  unidade: [
    v => !!v || 'Selecione uma Unidade.',
  ],
  codigoServico: [
    v => !!v || 'Selecione um Serviço.',
  ],
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
  vencimento: [
    (v) => {
      if (!v) return true

      const hoje = dayjs()
      const vencimento = dayjs(v, 'DD/MM/YYYY')

      if (vencimento.isSameOrAfter(hoje, 'day')) {
        return true
      }

      return 'O Vencimento precisa ser em data posterior à data de hoje.'
    },
  ],
  nomeContribuinte: [
    v => !!v || 'O Nome do Contribuinte é obrigatório.',
    v => (v?.length >= 2 && v?.length <= 45) || 'Nome do Contribuinte precisa ter entre 2 e 45 caracteres.',
  ],
  cnpjCpf: [
    v => !!v || 'CPF / CNPJ é obrigatório.',
    v => !v || ($isCPF(v) || $isCNPJ(v)) || 'CPF / CNPJ deve ser válido.',
  ],
  valorPrincipal: [
    v => !!v || 'Valor Principal é obrigatório.',
  ],
}

const store = useMainStore()
const { unidades, servicos } = storeToRefs(store)

const { error, pending } = await store.fetchUnidades()
if (error.value) {
  useToast().error('Ocorreu um erro ao carregar as Unidades: ' + error.value.message)
  console.error(error)
}

const pagamentoStore = usePagamentoStore()
const {
  codigoServico,
  referencia,
  competencia,
  vencimento,
  nomeContribuinte,
  cnpjCpf,
  valorPrincipal,
  valorDescontos,
  valorOutrasDeducoes,
  valorMulta,
  valorJuros,
  valorOutrosAcrescimos,
} = storeToRefs(pagamentoStore)

const isReferenciaRequired = ref(false)

watch(codigoServico, (newValue) => {
  const servico = servicos.value.find(s => toRaw(s).codigo == newValue)
  isReferenciaRequired.value = servico?.referencia_required ?? false
})

const showCompetencia = ref(false)
const showVencimento = ref(false)

watch(competencia, () => {
  showCompetencia.value = false
})
watch(vencimento, () => {
  showVencimento.value = false
})

const competenciaFormatted = computed(() => {
  if (!competencia.value) return null

  return dayjs(competencia.value).format('MM/YYYY')
})

const vencimentoFormatted = computed(() => {
  if (!vencimento.value) return null

  return dayjs(vencimento.value).format('DD/MM/YYYY')
})

const cnpjCpfFormatted = computed(useComputedMaskedCnpjCpf(cnpjCpf))

const valorPrincipalFormatted = computed(useComputedMaskedCurrency(valorPrincipal))
const valorDescontosFormatted = computed(useComputedMaskedCurrency(valorDescontos))
const valorOutrasDeducoesFormatted = computed(useComputedMaskedCurrency(valorOutrasDeducoes))
const valorMultaFormatted = computed(useComputedMaskedCurrency(valorMulta))
const valorJurosFormatted = computed(useComputedMaskedCurrency(valorJuros))
const valorOutrosAcrescimosFormatted = computed(useComputedMaskedCurrency(valorOutrosAcrescimos))

const loadingServicos = ref(false)

async function fetchServicos(unidade_id) {
  loadingServicos.value = true

  codigoServico.value = null

  const { error } = await store.fetchServicos({ unidade: unidade_id })
  if (error.value) {
    useToast().error('Ocorreu um erro ao carregar os Serviços: ' + error.value.message)
    console.error(error)
  }
  loadingServicos.value = false
}

async function handleSubmit() {
  const { valid } = await formNode.value.validate()

  if (valid) {
    emit('ok')
  }
}

function handleCancel() {
  formNode.value.reset()
  emit('cancel')
}
</script>
