<template>
  <v-container>
    <PageTitle>Administração</PageTitle>
    <v-row justify="center">
      <v-col
        v-if="numUnidades"
        cols="12"
        md="3"
      >
        <AdminInfoCount
          :num="numUnidades"
          icon="mdi-office-building-marker"
        >
          Unidades
        </AdminInfoCount>
      </v-col>
      <v-col
        v-if="numServicos"
        cols="12"
        md="3"
      >
        <AdminInfoCount
          :num="numServicos"
          icon="mdi-basket"
        >
          Serviços
        </AdminInfoCount>
      </v-col>
      <v-col
        v-if="numPagamentos"
        cols="12"
        md="3"
      >
        <AdminInfoCount
          :num="numPagamentos"
          icon="mdi-credit-card-outline"
        >
          Pagamentos
        </AdminInfoCount>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  title: 'Área Administrativa',
})

const numUnidades = ref()
const numServicos = ref()
const numPagamentos = ref()

const { data, error } = await useFetch('/api/info/count')

if (error.value) {
  useToast().error('Ocorreu um erro ao carregar as informações sobre o sistema: ' + error.message)
  console.error(error)
}

numUnidades.value = data.value.unidades
numServicos.value = data.value.servicos
numPagamentos.value = data.value.pagamentos
</script>
