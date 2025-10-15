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
definePageMeta({
  validate: async () => {
    return useACL().can('create', 'Servico')
  },
})

useHead({
  title: 'Cadastro de Novo Serviço',
})

const servicoStore = useServicoStore()

const submitting = ref(false)

onBeforeRouteLeave(() => {
  servicoStore.$reset()
})

async function handleSubmit() {
  submitting.value = true

  try {
    const servico = {
      ...servicoStore.$state,
      unidade: (Object.prototype.hasOwnProperty.call(servicoStore.unidade, '_id')) ? servicoStore.unidade._id : servicoStore.unidade,
    }

    await $fetch('/api/servicos', {
      method: 'POST',
      body: servico,
    })

    useToast().success('Serviço cadastrado com sucesso!')
    await navigateTo({ path: '/admin/servicos' })
  } catch (error) {
    useToast().error('Ocorreu um erro ao cadastrar o Serviço. ' + error.message)
    console.error(error)
  } finally {
    submitting.value = false
  }
}

async function handleCancel() {
  useToast().info('Cadastro de Serviço cancelado.')
  await navigateTo({ path: '/admin/servicos' })
}
</script>
