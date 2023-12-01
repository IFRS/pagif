<template>
  <Pie
    v-if="data"
    id="chart-formas-de-pagamento"
    :options="chartOptions"
    :data="chartData"
  />
</template>

<script setup>
  import { Pie } from 'vue-chartjs'
  import { Chart as ChartJS, Tooltip, Legend, PieController, ArcElement } from 'chart.js'

  ChartJS.register(Tooltip, Legend, PieController, ArcElement)

  const { data, error } = await useFetch('/api/info/pagamentos_por_tipo')
  if (error.value) {
    useToast().error('Ocorreu um erro ao carregar as informações sobre o sistema: ' + error.message)
    console.error(error)
  }

  const tipos = []

  data.value.forEach((element) => {
    tipos[element._id] = element.count
  })

  const chartData = computed(() => (
    {
      labels: [
        'Pix',
        'Cartão de Crédito',
        'Boleto GRU',
        'Não Informado',
      ],
      datasets: [
        {
          label: 'Pagamentos',
          data: [tipos.PIX ?? 0, tipos.CARTAO_CREDITO ?? 0, tipos.BOLETO ?? 0, tipos.null ?? 0],
          backgroundColor: [
            '#37b4aa', // Pix
            '#2378C3', // CC
            '#E5A000', // GRU
            '#565C65', // não informado
          ],
          hoverOffset: 10,
        },
      ],
    }
  ))

  const chartOptions = {}
</script>

<style lang="scss" scoped>

</style>
