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
import { useUsuarioStore } from '~/store/usuario'

definePageMeta({
  validate: async () => {
    return useACL().can('update', 'Usuario')
  }
})

useHeadSafe({
  title: 'Edição de Usuário',
})

const usuarioStore = useUsuarioStore()

const submitting = ref(false)

async function handleSubmit() {
  submitting.value = true

  const { error } = await usuarioStore.update()
  if (error.value) {
    useToast().error('Ocorreu um erro ao atualizar o Usuário. ' + error.value.message)
    console.error(error)
  } else {
    useToast().success('Usuário atualizado com sucesso!')
    await navigateTo({ path: '/admin/usuarios' })
  }

  submitting.value = false
}

async function handleCancel() {
  useToast().info('Edição do Usuário cancelada.')
  await navigateTo({ path: '/admin/usuarios' })
}

onUnmounted(() => {
  usuarioStore.$reset()
})
</script>
