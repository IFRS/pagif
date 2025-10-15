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

useHead({
  title: 'Configurações',
})

const configStore = useConfigStore()

const submitting = ref(false)

async function handleSubmit() {
  submitting.value = true

  try {
    await $fetch('/api/settings', {
      method: 'POST',
      body: { sigla: configStore.sigla, orgao: configStore.orgao, intro: configStore.intro },
    })

    useToast().success('Configurações salvas com sucesso!')
    await navigateTo({ path: '/admin' })
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
