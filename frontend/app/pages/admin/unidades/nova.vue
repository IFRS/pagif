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

useHead({
  title: 'Cadastro de Nova Unidade',
})

const unidadeStore = useUnidadeStore()

const submitting = ref(false)

onBeforeRouteLeave(() => {
  unidadeStore.$reset()
})

async function handleSubmit() {
  submitting.value = true

  try {
    await $fetch('/api/unidades', {
      method: 'POST',
      body: { ...unidadeStore.$state },
      onResponse() {
        unidadeStore.$reset()
      },
    })

    useToast().success('Unidade Gestora cadastrada com sucesso!')
    await navigateTo({ path: '/admin/unidades' })
  } catch (error) {
    useToast().error('Ocorreu um erro ao cadastrar a Unidade Gestora. ' + error.message)
    console.error(error)
  } finally {
    submitting.value = false
  }
}

async function handleCancel() {
  useToast().info('Cadastro de Unidade Gestora cancelado.')
  await navigateTo({ path: '/admin/unidades' })
}
</script>
