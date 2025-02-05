<template>
  <v-container>
    <v-row>
      <v-col>
        <PageTitle>Nova Unidade Gestora</PageTitle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <FormUnidade
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
    return useACL().can('create', 'Unidade')
  },
})

useHeadSafe({
  title: 'Cadastro de Nova Unidade',
})

const unidadeStore = useUnidadeStore()

const submitting = ref(false)

async function handleSubmit() {
  submitting.value = true

  const { error } = await unidadeStore.save()

  submitting.value = false

  if (error.value) {
    useToast().error('Ocorreu um erro ao cadastrar a Unidade Gestora. ' + error.value.message)
    console.error(error)
  } else {
    useToast().success('Unidade Gestora cadastrada com sucesso!')
    await navigateTo({ path: '/admin/unidades' })
  }
}

async function handleCancel() {
  useToast().info('Cadastro de Unidade Gestora cancelado.')
  await navigateTo({ path: '/admin/unidades' })
}

onUnmounted(() => {
  unidadeStore.$reset()
})
</script>
