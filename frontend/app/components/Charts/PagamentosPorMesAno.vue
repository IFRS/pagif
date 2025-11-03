
<script setup>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Tooltip, Legend, LineController, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'
import { useMainStore } from '~/stores'
import colors from 'vuetify/util/colors'

ChartJS.register(Tooltip, Legend, LineController, LineElement, CategoryScale, LinearScale, PointElement)

const unidade = ref()

const store = useMainStore()
const { unidades } = storeToRefs(store)

const { data: dataUnidades, status: statusUnidades, error: errorUnidades } = await useFetch('/api/unidades')

if (dataUnidades.value) {
  unidades.value = dataUnidades.value
}

if (errorUnidades.value) {
  useToast().error('Ocorreu um erro ao carregar as Unidades: ' + errorUnidades.message)
  console.error(errorUnidades)
}

const { data, error, pending } = await useFetch('/api/info/pagamentos_por_mes_ano', {
  query: { unidade: unidade },
})
if (error.value) {
  useToast().error('Ocorreu um erro ao carregar as informações sobre o sistema: ' + error.value.message)
  console.error(error)
}

// Mapear situação -> cor (valores hex aproximados das classes Vuetify solicitadas)
const situacaoColors = {
  CRIADO: colors.blue.accent2,
  INICIADO: colors.blue.accent3,
  SUBMETIDO: colors.blue.accent4,
  CONCLUIDO: colors.lightGreen.darken2,
  REJEITADO: colors.red.darken3,
  CANCELADO: colors.deepOrange.darken3,
}

const colorForSituacao = (situacao) => {
  const s = situacao || ''
  const entry = situacaoColors[s] || null
  if (entry) {
    // usar cor sólida igual para border e background
    return { border: entry, background: entry }
  }
  // fallback: usar cor de DESCONHECIDO quando não mapeado
  const fallback = '#000000'
  return { border: fallback, background: fallback }
}

const chartData = computed(() => {
  const labels = data.value?.labels || []
  const datasetsRaw = data.value?.datasets || []

  // Formata 'YYYY-MM' para 'mes/AAAA' em pt-BR (ex: 'fev/2025')
  const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  const formatPeriod = (period) => {
    if (!period || typeof period !== 'string') return period
    const parts = period.split('-')
    if (parts.length !== 2) return period
    const [yyyy, mm] = parts
    const m = parseInt(mm, 10)
    if (Number.isNaN(m) || m < 1 || m > 12) return period
    return `${monthNames[m - 1]}/${yyyy}`
  }

  const labelsFormatted = labels.map(formatPeriod)

  const datasets = datasetsRaw.map((ds, i) => {
    const { border, background } = colorForSituacao(ds.label)
    return {
      ...ds,
      borderColor: border,
      backgroundColor: background,
      pointBackgroundColor: border,
      pointBorderColor: border,
      borderWidth: 2,
      pointRadius: 3,
      tension: 0.3,
      fill: true,
    }
  })

  return { labels: labelsFormatted, datasets }
})

const chartOptions = {
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        callback: (value) => {
          const n = Number(value)
          if (Number.isNaN(n)) return value
          return String(Math.round(n))
        },
      },
    },
  },
}
</script>

<template>
  <v-responsive
    class="mx-auto"
    max-width="400"
  >
    <!-- Unidade -->
    <v-autocomplete
      v-model="unidade"
      prepend-inner-icon="mdi-office-building-marker"
      label="Unidade Gestora"
      variant="filled"
      density="comfortable"
      clearable
      :loading="statusUnidades == 'pending'"
      :disabled="statusUnidades == 'pending' || unidades?.length === 1"
      :items="unidades"
      item-title="nome"
      item-value="_id"
    />
  </v-responsive>
  <v-responsive
    v-if="pending"
    :aspect-ratio="2.5"
    class="align-center justify-center"
  >
    <v-progress-circular
      indeterminate
      :size="128"
    />
  </v-responsive>

  <Line
    v-else
    :data="chartData"
    :options="chartOptions"
  />
</template>
