<template>
  <v-container></v-container>
</template>

<script>
export default {
  name: 'Index',
  beforeCreate() {
    if (this.$route.query.unidade) {
      const unidade = this.$store.getters['unidades'].find(unidade => (unidade.slug && unidade.slug === this.$route.query.unidade));
      if (unidade) {
        this.$store.commit('unidade/replace', unidade);
      }

      this.$router.replace({ 'query': null });
    }
  },
}
</script>
