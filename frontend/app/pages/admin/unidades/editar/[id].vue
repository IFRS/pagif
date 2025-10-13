<template>
  <v-container>
    <v-row>
      <v-col>
        <PageTitle>Editar Unidade Gestora "{{ nome }}"</PageTitle>
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
    return useACL().can('update', 'Unidade')
  },
})

useHeadSafe({
  title: 'Edição de Unidade',
})

const unidadeStore = useUnidadeStore()
const route = useRoute()

const { nome } = storeToRefs(unidadeStore)

const submitting = ref(false)

const { data, error } = await useFetch(`/api/unidades/${route.params.id}`)

if (data.value) {
  unidadeStore.$patch(data.value)
}

if (error.value) {
  useToast().error('Ocorreu um erro ao buscar a Unidade Gestora: ' + error.value.message)
  console.error(error)
  await navigateTo({ path: '/admin/unidades' })
}

onBeforeRouteLeave(() => {
  unidadeStore.$reset()
})

async function handleSubmit() {
  submitting.value = true

  try {
    await $fetch(`/api/unidades/${unidadeStore._id}`, {
      method: 'PUT',
      body: { ...unidadeStore.$state },
      onResponse() {
        unidadeStore.$reset()
      },
    })

    useToast().success('Unidade Gestora atualizada com sucesso!')
    await navigateTo({ path: '/admin/unidades' })
  } catch (error) {
    useToast().error('Ocorreu um erro ao atualizar a Unidade Gestora. ' + error.message)
    console.error(error)
  }

  submitting.value = false
}

async function handleCancel() {
  useToast().info('Edição da Unidade Gestora cancelada.')
  await navigateTo({ path: '/admin/unidades' })
}
</script>
