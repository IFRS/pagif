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
import { usePagamentoStore } from '~/store/pagamento'

definePageMeta({
  title: 'Nova Cobrança',
  validate: async () => {
    return useACL().can('create', 'Pagamento')
  }
})

const submitting = ref(false)

const pagamentoStore = usePagamentoStore()

async function handleSubmit() {
  submitting.value = true

  const { error } = await pagamentoStore.save()
  if (error.value) {
    useToast().error('Ocorreu um erro ao cadastrar a Cobrança. ' + error.message)
    console.error(error)
  } else {
    useToast().success('Cobrança cadastrada com sucesso!')
    pagamentoStore.$reset()
    await navigateTo({ path: '/admin/pagamentos' })
  }

  submitting.value = false
}

async function handleCancel() {
  useToast().info('Cadastro de Cobrança cancelado.')
  await navigateTo({ path: '/admin/pagamentos' })
}

onUnmounted(() => {
  pagamentoStore.$reset()
})
</script>
