<template>
  <span :class="color(situacao)"><slot>{{ situacao }}</slot></span>
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
          return 'indigo--text text--lighten-3';
        break;
        case 'INICIADO':
          return 'cyan--text text--lighten-3';
        break;
        case 'SUBMETIDO':
          return 'brown--text text-lighten-3';
        break;
        case 'CONCLUIDO':
          return 'success--text';
        break;
        case 'REJEITADO':
          return 'warning--text';
        break;
        case 'CANCELADO':
          return 'error--text';
        break;
        default:
          return '';
        break;
      }
    },
  },
}
</script>
