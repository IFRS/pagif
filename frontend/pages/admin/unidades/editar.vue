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
          :token-loading="pending"
          :submitting="submitting"
          @ok="handleSubmit"
          @cancel="handleCancel"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUnidadeStore } from '~/store/unidade'

definePageMeta({
  title: 'Edição de Unidade',
  validate: async () => {
    return useACL().can('update', 'Unidade')
  }
})

const unidadeStore = useUnidadeStore()

const { nome } = storeToRefs(unidadeStore)

const submitting = ref(false)

const { error, pending } = await unidadeStore.fetchToken()
if (error.value) {
  useToast().error('Ocorreu um erro ao buscar o Token da Unidade: ' + error.value.message)
  console.error(error)
}

async function handleSubmit() {
  submitting.value = true

  const { error } = await unidadeStore.update()

  if (error.value) {
    useToast().error('Ocorreu um erro ao atualizar a Unidade Gestora. ' + error.value.message)
    console.error(error)
  } else {
    useToast().success('Unidade Gestora atualizada com sucesso!')
    await navigateTo({ path: '/admin/unidades' })
  }

  submitting.value = false
}

async function handleCancel() {
  useToast().info('Edição da Unidade Gestora cancelada.')
  await navigateTo({ path: '/admin/unidades' })
}

onUnmounted(() => {
  unidadeStore.$reset()
})
</script>
