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
import { onUnmounted } from 'vue'
import { useUnidadeStore } from '~/store/unidade'

definePageMeta({
  layout: 'admin',
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
  useToast().error('Ocorreu um erro ao buscar o Token da Unidade: ' + error.message)
  console.error(error)
}

async function handleSubmit() {
  submitting.value = true

  const { error } = await unidadeStore.update()

  if (error.value) {
    useToast().error('Ocorreu um erro ao atualizar a Unidade Gestora. ' + error.message)
    console.error(error)
  } else {
    useToast().success('Unidade Gestora atualizada com sucesso!')
    navigateTo({ path: '/admin/unidades' })
  }

  submitting.value = false
}

function handleCancel() {
  useToast().info('Edição da Unidade Gestora cancelada.')
  navigateTo({ path: '/admin/unidades' })
}

onUnmounted(() => {
  unidadeStore.$reset()
})
</script>
