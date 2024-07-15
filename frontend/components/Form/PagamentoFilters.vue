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
      <FilterUnidades
        ref="unidadesNode"
        @filtro="addFiltro"
      />
      <FilterSituacoes
        ref="situacoesNode"
        @filtro="addFiltro"
      />
      <FilterDatas
        ref="datasNode"
        @filtro="addFiltro"
      />
      <v-row
        justify="start"
        dense
      >
        <v-col cols="auto">
          <v-btn
            color="primary"
            type="submit"
            :disabled="isFiltrosEmpty"
          >
            Filtrar Pagamentos
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn
            color="secondary"
            @click="limpar()"
          >
            Limpar Filtros
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-navigation-drawer>
</template>

<script setup>
import { useDisplay } from 'vuetify'

defineProps({
  'modelValue': Boolean,
})

const emit = defineEmits(['update:modelValue', 'filtrar'])

const formNode = ref(null)
const unidadesNode = ref(null)
const situacoesNode = ref(null)
const datasNode = ref(null)

const { name } = useDisplay()

const drawerWidth = computed(() => {
  switch (name.value) {
    case 'xxl': return '800'
    case 'xl': return '640'
    case 'lg': return '640'
    case 'md': return '480'
    case 'sm': return false
    case 'xs': return false
    default: return false
  }
})

const filtros = ref({})

const isFiltrosEmpty = computed(() => {
  return Object.keys(filtros.value).length === 0 || Object.values(filtros.value).length === 0 || Object.values(filtros.value).every((value) => {
    return Array.isArray(value) ? value.length === 0 : !value
  })
})

function addFiltro(filtro) {
  Object.assign(filtros.value, filtro)
}

function filtrar() {
  emit('filtrar', toRaw(unref(filtros)))
  emit('update:modelValue', false)
}

function limpar() {
  unidadesNode.value.limpa()
  situacoesNode.value.limpa()
  datasNode.value.limpa()

  nextTick(() => {
    filtros.value = new Object()
    filtrar()
  })
}
</script>
