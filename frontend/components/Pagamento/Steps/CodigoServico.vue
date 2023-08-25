<template>
  <v-form
    ref="form"
    v-bind="$attrs"
  >
    <v-text-field
      prepend-icon="mdi-office-building-marker"
      label="Unidade"
      disabled
      :model-value="configStore.unidade?.nome"
    />

    <v-autocomplete
      v-model="selectedServico"
      prepend-icon="mdi-basket"
      label="Serviço"
      no-data-text="Nenhum Serviço encontrado na Unidade atual."
      :rules="validation"
      :loading="pending"
      :disabled="pending"
      :items="servicos"
      required
    />
  </v-form>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useMainStore } from '~/store';
import { useConfigStore } from '~/store/config';
import { usePagamentoStore } from '~/store/pagamento';

const form = ref(null)
async function validateForm() {
  return await form.value.validate()
}
defineExpose({
  validateForm,
})

const validation = [
  v => !!v || 'Selecione um Serviço.',
]

const store = useMainStore()
const configStore = useConfigStore()
const { pending, error } = await store.fetchServicos({ isPublic: true, unidade: configStore.unidade?._id })
if (error.value) {
  useToast().error('Ocorreu um erro ao carregar os Serviços.')
  console.error(error)
}

const pagamentoStore = usePagamentoStore();
const { codigoServico, nomeServico } = storeToRefs(pagamentoStore)

const servicos = computed(() => {
  return store.servicos.map((item) => {
    return {
      title: `${item.nome} (${item.codigo})`,
      value: item._id
    }
  })
})

const selectedServico = ref(null)

watch(selectedServico, (newServico) => {
  const servico = store.servicos.find((servico) => {
    return servico._id = newServico
  })
  codigoServico.value = servico?.codigo
  nomeServico.value = servico?.nome
})
</script>
