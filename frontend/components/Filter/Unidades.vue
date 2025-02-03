<template>
  <v-card flat>
    <v-card-text>
      <v-autocomplete
        v-model="unidadesSelected"
        :loading="pending"
        :items="unidades"
        density="compact"
        multiple
        clearable
        chips
        label="Unidades"
        item-title="nome"
        item-value="nome"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
const emit = defineEmits(['filtro'])

const unidadesSelected = ref([])

watch(unidadesSelected, (newUnidades) => {
  emit('filtro', { unidades: toRaw(newUnidades) })
}, { deep: true })

function limpa() {
  unidadesSelected.value = []
}

defineExpose({ limpa })

const { data: unidades, error, pending } = await useFetch('/api/unidades')

if (error.value) {
  useToast().error('Ocorreu um erro obter a lista de Unidades. ' + error.value.message)
}
</script>
