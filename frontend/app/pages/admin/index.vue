<template>
  <v-container>
    <PageTitle>Administra&ccedil;&atilde;o</PageTitle>
    <v-row>
      <v-col
        cols="12"
        md="5"
        lg="4"
      >
        <v-card
          title="Formas de Pagamento"
          subtitle="Exibe a quantidade de Pagamentos em cada forma de pagamento disponível."
          variant="flat"
          class="h-100 text-center"
        >
          <v-card-text>
            <ChartsFormasDePagamento />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="7"
        lg="8"
      >
        <v-card
          title="Serviços mais usados"
          subtitle="Exibe a quantidade de Pagamentos dos 5 Serviços mais utilizados."
          variant="flat"
          class="h-100 text-center"
        >
          <v-card-text>
            <ChartsServicos />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col
        v-if="numUnidades"
        cols="12"
        sm="6"
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
        sm="6"
        md="3"
      >
        <AdminInfoCount
          :num="numServicos"
          icon="mdi-basket"
        >
          Servi&ccedil;os
        </AdminInfoCount>
      </v-col>
      <v-col
        v-if="numPagamentos"
        cols="12"
        sm="6"
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
useHeadSafe({
  title: 'Área Administrativa',
})

const numUnidades = ref(0)
const numServicos = ref(0)
const numPagamentos = ref(0)

const { data, error } = await useFetch('/api/info/count')

if (error.value) {
  useToast().error('Ocorreu um erro ao carregar as informações sobre o sistema: ' + error.value.message)
  console.error(error)
}

numUnidades.value = data.value.unidades
numServicos.value = data.value.servicos
numPagamentos.value = data.value.pagamentos
</script>
