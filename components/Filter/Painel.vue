<template>
  <v-sheet>
    <slot
      name="activator"
      :on="{ click: handleActivator }"
    />
    <v-navigation-drawer
      v-bind="$attrs"
      location="right"
      absolute
      temporary
      class="pa-3"
      :width="drawerWidth"
      v-on="$listeners"
    >
      <template #prepend>
        <v-toolbar
          dense
          flat
        >
          <v-toolbar-title>Filtros</v-toolbar-title>
          <v-spacer />
          <v-btn
            icon
            @click="$emit('input', false)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
      </template>
      <v-form
        ref="form"
        @submit.prevent="filtrar()"
        @filtro="addFiltro"
      >
        <slot />
        <v-btn
          color="primary"
          type="submit"
        >
          Filtrar
        </v-btn>
        <v-btn
          color="secondary"
          @click="limpar()"
        >
          Limpar
        </v-btn>
      </v-form>
    </v-navigation-drawer>
  </v-sheet>
</template>

<script>
export default {
  name: 'FilterPainel',
  data() {
    return {
      filtros: {},
    }
  },
  computed: {
    drawerWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 'auto';
        case 'sm': return 'auto';
        case 'md': return '50%';
        case 'lg': return '30%';
        case 'xl': return '30%';
      }
    },
  },
  methods: {
    handleActivator() {
      this.$emit('input', !this.$attrs.value);
    },
    addFiltro(filtro) {
      Object.assign(this.filtros, filtro);
    },
    filtrar() {
      this.$emit('filtrar', this.filtros);
      this.$emit('input', false);
    },
    limpar() {
      this.$refs.form.reset();
      this.$nextTick(() => {
        this.filtros = new Object();
        this.filtrar();
      });
    }
  },
}
</script>
