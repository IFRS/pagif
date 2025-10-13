<template>
  <span
    class="d-inline-block pa-1 font-weight-medium text-white"
    :class="color"
  ><slot>{{ situacao }}</slot></span>
</template>

<script setup>
const props = defineProps({
  situacao: {
    type: String,
    default: '',
  },
})

const color = computed(() => {
  switch (props.situacao) {
    case 'CRIADO':
      return 'bg-blue-accent-2'
      break
    case 'INICIADO':
      return 'bg-blue-accent-3'
      break
    case 'SUBMETIDO':
      return 'bg-blue-accent-4'
      break
    case 'CONCLUIDO':
      return 'bg-light-green-darken-2'
      break
    case 'REJEITADO':
      return 'bg-red-darken-3'
      break
    case 'CANCELADO':
      return 'bg-deep-orange-darken-3'
      break
    default:
      return 'bg-black'
      break
  }
})
</script>
