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
      variant="solo"
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
  <Bar
    v-else-if="data"
    id="chart-servicos"
    :options="chartOptions"
    :data="chartData"
  />
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Tooltip, Legend, BarController, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { useMainStore } from '~/stores'

ChartJS.register(Tooltip, Legend, BarController, BarElement, CategoryScale, LinearScale)

const unidade = ref()

const store = useMainStore()
const { unidades } = storeToRefs(store)

const { data: dataUnidades, status: statusUnidades, error: errorUnidades } = await useFetch('/api/unidades')

if (dataUnidades.value) {
  unidades.value = data.value
}

if (errorUnidades.value) {
  useToast().error('Ocorreu um erro ao carregar as Unidades: ' + errorUnidades.message)
  console.error(errorUnidades)
}

const { data, error, pending } = await useFetch('/api/info/pagamentos_por_servicos', {
  query: { unidade: unidade },
})
if (error.value) {
  useToast().error('Ocorreu um erro ao carregar as informações sobre o sistema: ' + error.value.message)
  console.error(error)
}

const servicos_graph = computed(() => {
  return data.value.slice(0, 5)
})

const chartData = computed(() => (
  {
    labels: servicos_graph.value.map(e => e._id),
    datasets: [
      {
        label: 'Pagamentos',
        data: servicos_graph.value.map(e => e.count),
        backgroundColor: [
          '#665190',
          '#8168B3',
          '#9D84D2',
          '#B8A2E3',
          '#D0C3E9',
        ],
      },
    ],
  }
))

const chartOptions = {
  plugins: {
    legend: {
      display: false,
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
