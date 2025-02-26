<template>
  <v-container>
    <v-row>
      <v-col>
        <PageTitle>Editar Servi&ccedil;o "{{ nome }}"</PageTitle>
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
    return useACL().can('update', 'Servico')
  },
})

useHeadSafe({
  title: 'Edição de Serviço',
})

const servicoStore = useServicoStore()
const route = useRoute()

const { nome } = storeToRefs(servicoStore)

const submitting = ref(false)

const { data, error } = await useFetch(`/api/servicos/${route.params.id}`)

if (data.value) {
  servicoStore.$patch(data.value)
}

if (error.value) {
  useToast().error('Ocorreu um erro ao buscar o Serviço: ' + error.value.message)
  console.error(error)
  await navigateTo({ path: '/admin/servicos' })
}

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

    await $fetch(`/api/servicos/${servicoStore._id}`, { method: 'PUT', body: servico })

    useToast().success('Serviço atualizado com sucesso!')
    await navigateTo({ path: '/admin/servicos' })
  } catch (error) {
    useToast().error('Ocorreu um erro ao atualizar o Serviço. ' + error.value.message)
    console.error(error)
  } finally {
    submitting.value = false
  }
}

async function handleCancel() {
  useToast().info('Edição do Serviço cancelada.')
  await navigateTo({ path: '/admin/servicos' })
}
</script>
