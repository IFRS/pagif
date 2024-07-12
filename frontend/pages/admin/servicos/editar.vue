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
import { storeToRefs } from 'pinia'
import { useServicoStore } from '~/store/servico'

definePageMeta({
  title: 'Edição de Serviço',
  validate: async () => {
    return useACL().can('update', 'Servico')
  }
})

const servicoStore = useServicoStore()

const { nome } = storeToRefs(servicoStore)

const submitting = ref(false)

async function handleSubmit() {
  submitting.value = true

  const { error } = await servicoStore.update()
  if (error.value) {
    useToast().error('Ocorreu um erro ao atualizar o Serviço. ' + error.value.message)
    console.error(error)
  } else {
    useToast().success('Serviço atualizado com sucesso!')
    await navigateTo({ path: '/admin/servicos' })
  }

  submitting.value = false
}

async function handleCancel() {
  useToast().info('Edição do Serviço cancelada.')
  await navigateTo({ path: '/admin/servicos' })
}

onUnmounted(() => {
  servicoStore.$reset()
})
</script>
