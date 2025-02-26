<template>
  <v-container>
    <PageTitle>Configura&ccedil;&otilde;es</PageTitle>
    <FormSettings
      :submitting="submitting"
      @ok="handleSubmit"
      @cancel="handleCancel"
    />
  </v-container>
</template>

<script setup>
definePageMeta({
  validate: async () => {
    return useACL().can('update', 'Settings')
  },
})

useHeadSafe({
  title: 'Configurações',
})

const { updateSettings } = useFetchSettings()
const { error, status, execute } = useAsyncData(() => updateSettings(), { immediate: false })

watch(error, (newError) => {
  useToast().error('Ocorreu um erro ao salvar as Configurações. ' + newError.message)
  console.error(newError)
})

const submitting = computed(() => status.value === 'pending')

watch(status, (newStatus) => {
  if (newStatus === 'success') {
    useToast().success('Configurações salvas com sucesso!')
  }
})

async function handleSubmit() {
  await execute()
}

async function handleCancel() {
  useToast().info('Edição das Configurações cancelada.')
  await navigateTo({ path: '/admin' })
}
</script>
