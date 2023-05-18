<template>
  <span
    class="d-inline-block pa-1 font-weight-medium text-white"
    :class="color(situacao)"
  ><slot>{{ situacao }}</slot></span>
</template>

<script>
export default {
  name: 'PagamentoSituacao',
  props: {
    situacao: {
      type: String,
      default: '',
    },
  },
  methods: {
    color(situacao) {
      switch (situacao) {
        case 'CRIADO':
          return 'blue accent-2';
        break;
        case 'INICIADO':
          return 'blue accent-3';
        break;
        case 'SUBMETIDO':
          return 'blue accent-4';
        break;
        case 'CONCLUIDO':
          return 'light-green darken-2';
        break;
        case 'REJEITADO':
          return 'red darken-3';
        break;
        case 'CANCELADO':
          return 'deep-orange darken-3';
        break;
        default:
          return '';
        break;
      }
    },
  },
}
</script>
