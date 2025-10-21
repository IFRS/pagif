<template>
  <v-container>
    <v-row>
      <v-col>
        <PageTitle>Nova Cobran&ccedil;a</PageTitle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <FormPagamento
          :submitting="submitting"
          @ok="handleSubmit"
          @cancel="handleCancel"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({
  validate: async () => {
    return useACL().can('create', 'Pagamento')
  },
})

useHead({
  title: 'Nova Cobrança',
})

const submitting = ref(false)

const pagamentoStore = usePagamentoStore()

async function handleSubmit() {
  submitting.value = true

  try {
    await $fetch('/api/pagamentos', {
      method: 'POST',
      body: { ...pagamentoStore.$state },
    })

    useToast().success('Cobrança cadastrada com sucesso!')
    await navigateTo({ path: '/admin/pagamentos' })
  } catch (error) {
    useToast().error('Ocorreu um erro ao cadastrar a Cobrança. ' + error.value.message, error.value.details)
    console.error(error)
  } finally {
    submitting.value = false
  }
}

async function handleCancel() {
  useToast().info('Cadastro de Cobrança cancelado.')
  await navigateTo({ path: '/admin/pagamentos' })
}

onBeforeRouteLeave(() => {
  pagamentoStore.$reset()
})
</script>
