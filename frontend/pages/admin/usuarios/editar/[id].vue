<template>
  <v-container>
    <v-row>
      <v-col>
        <PageTitle>Novo Usu&aacute;rio</PageTitle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <FormUsuario
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
    return useACL().can('update', 'Usuario')
  },
})

useHeadSafe({
  title: 'Edição de Usuário',
})

const usuarioStore = useUsuarioStore()
const route = useRoute()

const submitting = ref(false)

const { data, error } = await useFetch(`/api/usuarios/${route.params.id}`)

if (data.value) {
  usuarioStore.$patch(data.value)
}

if (error.value) {
  useToast().error('Ocorreu um erro ao buscar o Usuário: ' + error.value.message)
  console.error(error)
  await navigateTo({ path: '/admin/usuarios' })
}

onBeforeRouteLeave(() => {
  usuarioStore.$reset()
})

async function handleSubmit() {
  submitting.value = true

  try {
    await $fetch(`/api/usuarios/${usuarioStore._id}`, {
      method: 'PUT',
      body: { ...usuarioStore.$state },
    })

    useToast().success('Usuário atualizado com sucesso!')
    await navigateTo({ path: '/admin/usuarios' })
  } catch (error) {
    useToast().error('Ocorreu um erro ao atualizar o Usuário. ' + error.message)
    console.error(error)
  } finally {
    submitting.value = false
  }
}

async function handleCancel() {
  useToast().info('Edição do Usuário cancelada.')
  await navigateTo({ path: '/admin/usuarios' })
}
</script>
