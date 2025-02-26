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

const settingsStore = useSettingsStore()

const submitting = ref(false)

async function handleSubmit() {
  submitting.value = true

  try {
    await $fetch('/api/settings', {
      method: 'POST',
      body: settingsStore.$state,
    })

    useToast().success('Configurações salvas com sucesso!')
  } catch (error) {
    useToast().error('Ocorreu um erro ao salvar as Configurações. ' + error.message)
    console.error(error)
  } finally {
    submitting.value = false
  }
}

async function handleCancel() {
  useToast().info('Edição das Configurações cancelada.')
  await navigateTo({ path: '/admin' })
}
</script>
