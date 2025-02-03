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
import { useSettingsStore } from '~/store/settings'

definePageMeta({
  validate: async () => {
    return useACL().can('edit', 'Settings')
  },
})

useHeadSafe({
  title: 'Configurações',
})

const submitting = ref(false)

const settingsStore = useSettingsStore()

async function handleSubmit() {
  submitting.value = true

  const { error } = await settingsStore.save()
  if (error.value) {
    useToast().error('Ocorreu um erro ao salvar as Configurações. ' + error.value.message)
    console.error(error)
  } else {
    useToast().success('Configurações salvas com sucesso!')
  }

  submitting.value = false
}

async function handleCancel() {
  useToast().info('Edição das Configurações cancelada.')
  await navigateTo({ path: '/admin' })
}

onUnmounted(() => {
  settingsStore.$reset()
})
</script>
