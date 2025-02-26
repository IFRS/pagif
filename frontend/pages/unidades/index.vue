<template>
  <v-container>
    <PageTitle>Escolha uma Unidade para Pagamento</PageTitle>

    <v-btn
      v-for="(unidade, i) in store.unidades"
      :key="i"
      size="x-large"
      color="primary"
      variant="tonal"
      rounded="pill"
      class="me-2 mb-2"
      @click="escolha(unidade)"
    >
      {{ unidade.nome }}
    </v-btn>
  </v-container>
</template>

<script setup>
useHeadSafe({
  title: 'Escolha uma Unidade',
})

const store = useMainStore()
const configStore = useConfigStore()

const { data, error } = await useFetch('/api/public/unidades')

if (data.value) {
  store.unidades = data.value
}

if (error.value) {
  useToast().error('Ocorreu um erro ao carregar as Unidades.')
  console.error(error)
}

const route = useRoute()
async function escolha(unidade) {
  configStore.unidade = unidade
  await navigateTo({ path: route.query.returnPath || '/' })
}
</script>
