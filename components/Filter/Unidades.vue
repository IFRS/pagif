<template>
  <v-card flat>
    <v-card-text>
      <v-autocomplete
        v-model="unidadesSelected"
        :loading="$fetchState.pending"
        :items="unidades"
        dense
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

<script>
export default {
  name: 'FilterUnidades',
  data() {
    return {
      unidades: null,
      unidadesSelected: [],
    }
  },
  async fetch() {
    await this.$axios.get('/api/unidades')
    .then((response) => {
      this.unidades = response.data;
    })
    .catch((error) => {
      this.$toast.error('Ocorreu um erro obter a lista de Unidades. ' + error.message);
    })
  },
  watch: {
    unidadesSelected(newValue) {
      this.$parent.$emit('filtro', { unidades: newValue });
    }
  },
}
</script>
