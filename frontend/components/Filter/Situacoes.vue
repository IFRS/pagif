<template>
  <v-card
    flat
    tag="fieldset"
  >
    <v-card-subtitle tag="legend">
      Situa&ccedil;&otilde;es
    </v-card-subtitle>
    <v-card-text class="d-flex flex-wrap">
      <v-checkbox
        v-for="situacao, index in situacoes"
        :key="index"
        v-model="situacoesSelected"
        :label="situacao"
        :value="situacao"
        density="compact"
        class="mr-5"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { watch } from 'vue'

const emit = defineEmits(['filtro'])

const situacoes = ['CRIADO', 'INICIADO', 'SUBMETIDO', 'CONCLUIDO', 'REJEITADO', 'CANCELADO']

const situacoesSelected = ref([])

watch(situacoesSelected, (newSituacoes) => {
  emit('filtro', { situacoes: toRaw(newSituacoes) })
}, { deep: true })
</script>
