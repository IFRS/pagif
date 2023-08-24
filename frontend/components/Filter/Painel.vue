<template>
  <v-navigation-drawer
    :model-value="modelValue"
    v-bind="$attrs"
    location="right"
    absolute
    temporary
    :width="drawerWidth"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #prepend>
      <v-toolbar
        dense
        flat
        color="transparent"
      >
        <v-toolbar-title tag="h3">
          Filtros
        </v-toolbar-title>
        <v-spacer />
        <v-btn
          icon
          variant="plain"
          @click="emit('update:modelValue', false)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
    </template>
    <v-form
      ref="formNode"
      class="pa-3"
      @submit.prevent="filtrar()"
    >
      <slot :add-filtro="addFiltro" />
      <v-row
        justify="start"
        dense
      >
        <v-col cols="auto">
          <v-btn
            color="primary"
            type="submit"
          >
            Filtrar
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn
            color="secondary"
            @click="limpar()"
          >
            Limpar
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-navigation-drawer>
</template>

<script setup>
import { useDisplay } from 'vuetify';

defineProps({
  'modelValue': Boolean,
})

const emit = defineEmits(['update:modelValue', 'filtrar'])

const formNode = ref(null)

const filtros = ref({})

const { name } = useDisplay()

const drawerWidth = computed(() => {
  switch (name) {
    case 'xl': return '30%'
    case 'lg': return '30%'
    case 'md': return '50%'
    case 'sm': return 'auto'
    case 'xs': return 'auto'
    default: return 'auto'
  }
})

function addFiltro(filtro) {
  Object.assign(filtros.value, filtro)
}

function filtrar() {
  emit('filtrar', toRaw(unref(filtros)))
  emit('update:modelValue', false)
}

function limpar() {
  formNode.value.reset()

  nextTick(() => {
    filtros.value = new Object()
    filtrar()
  })
}
</script>
