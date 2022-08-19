<template>
  <v-card flat tag="fieldset">
    <v-card-subtitle tag="legend">
      Situa&ccedil;&otilde;es
    </v-card-subtitle>
    <v-card-text class="d-flex flex-wrap justify-lg-space-between">
      <v-switch
        v-for="situacao, index in situacoes"
        :key="index"
        v-model="situacoesSelected"
        :label="situacao"
        :value="situacao"
        dense
      ></v-switch>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'FilterSituacoes',
  data() {
    return {
      situacoes: ['CRIADO', 'INICIADO', 'SUBMETIDO', 'CONCLUIDO', 'REJEITADO', 'CANCELADO'],
      situacoesSelected: [],
    }
  },
  watch: {
    situacoesSelected(newValue) {
      this.$parent.$emit('filtro', { situacoes: newValue });
    }
  },
}
</script>
