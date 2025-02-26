<template>
  <v-container>
    <PagamentoDetalhes :loading="status == 'pending'">
      <v-btn
        color="primary"
        variant="plain"
        :to="{ name: 'consulta' }"
      >
        Voltar
      </v-btn>
    </PagamentoDetalhes>
  </v-container>
</template>

<script setup>
useHeadSafe({
  title: 'Consulta Pagamento',
})

const route = useRoute()
const pagamentoStore = usePagamentoStore()

const { data, status, error } = await useFetch(`/api/public/pagamentos/${route.params.id}`)

if (data.value) {
  pagamentoStore.$patch(data.value)
}

if (error.value) {
  useToast().error('Ocorreu um erro ao buscar o Pagamento.')
  console.error(error.value)
  await navigateTo({ name: 'consulta' })
}

onBeforeRouteLeave(() => {
  pagamentoStore.$reset()
})
</script>
