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
  layout: 'admin',
  title: 'Cadastro de Novo Usuário',
  validate: async () => {
    return useACL().can('create', 'Usuario')
  }
})

const usuarioStore = useUsuarioStore()

const submitting = ref(false)

async function handleSubmit() {
  submitting.value = true

  const { error } = await usuarioStore.save()
  if (error.value) {
    useToast().error('Ocorreu um erro ao cadastrar o Usuário. ' + error.message)
    console.error(error)
  } else {
    useToast().success('Usuário cadastrado com sucesso!')
    await navigateTo({ path: '/admin/usuarios' })
  }

  submitting.value = false
}

async function handleCancel() {
  useToast().info('Cadastro de Usuário cancelado.')
  await navigateTo({ path: '/admin/usuarios' })
}

onUnmounted(() => {
  usuarioStore.$reset()
})
</script>
