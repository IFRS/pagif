<template>
  <v-container>
    <v-row>
      <v-col>
        <PageTitle>Novo Servi&ccedil;o</PageTitle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <FormServico
          :submitting="submitting"
          @ok="handleSubmit"
          @cancel="handleCancel"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useServicoStore } from '~/store/servico'

definePageMeta({
  validate: async () => {
    return useACL().can('create', 'Servico')
  },
})

useHeadSafe({
  title: 'Cadastro de Novo Serviço',
})

const servicoStore = useServicoStore()

const submitting = ref(false)

async function handleSubmit() {
  submitting.value = true

  const { error } = await servicoStore.save()

  submitting.value = false

  if (error.value) {
    useToast().error('Ocorreu um erro ao cadastrar o Serviço. ' + error.value.message)
    console.error(error)
  } else {
    useToast().success('Serviço cadastrado com sucesso!')
    await navigateTo({ path: '/admin/servicos' })
  }
}

async function handleCancel() {
  useToast().info('Cadastro de Serviço cancelado.')
  await navigateTo({ path: '/admin/servicos' })
}

onUnmounted(() => {
  servicoStore.$reset()
})
</script>
