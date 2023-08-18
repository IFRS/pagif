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
            @click="emit('input', false)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
      </template>
      <v-form
        ref="formNode"
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

<script setup>
import { nextTick } from 'vue';
import { computed } from 'vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const emit = defineEmits(['input', 'filtrar'])

const formNode = ref(null)

const filtros = ref({})

const name = useDisplay()

const drawerWidth = computed(() => {
  switch (name) {
    case 'xl': return '30%';
    case 'lg': return '30%';
    case 'md': return '50%';
    case 'sm': return 'auto';
    case 'xs': return 'auto';
    default: return 'auto';
  }
})

function handleActivator() {
  emit('input', $attrs.value);
}

function addFiltro(filtro) {
  Object.assign(filtros.value, filtro);
}

function filtrar() {
  emit('filtrar', filtros.value);
  emit('input', false);
}

function limpar() {
  formNode.reset()
  nextTick(() => {
    filtros.value = new Object()
    filtrar()
  })
}

defineExpose({ emit })
</script>
