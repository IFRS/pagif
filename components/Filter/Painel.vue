<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header>
        Filtros
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-form @submit.prevent="filtrar()" @filtro="addFiltro">
          <slot></slot>
          <v-btn color="primary" type="submit">Filtrar</v-btn>
        </v-form>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: 'FilterPainel',
  data() {
    return {
      filtros: {},
    }
  },
  methods: {
    addFiltro(filtro) {
      Object.assign(this.filtros, filtro);
    },
    filtrar() {
      this.$emit('filtrar', this.filtros);
    },
  },
}
</script>
