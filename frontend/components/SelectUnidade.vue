<template>
  <v-menu>
    <template #activator="{ props: menu }">
      <v-tooltip location="left">
        <template #activator="{ props: tooltip }">
          <v-btn
            color="primary"
            :variant="props.mobile ? 'tonal' : 'text'"
            :loading="pending"
            :disabled="!configStore.unidade"
            v-bind="mergeProps(menu, tooltip)"
          >
            {{ configStore.unidade?.nome || 'Selecione uma Unidade' }}
            <v-icon end>
              mdi-menu-down
            </v-icon>
          </v-btn>
        </template>
        <span>Trocar Unidade</span>
      </v-tooltip>
    </template>
    <v-list v-model:selected="selectedUnidade">
      <v-list-subheader>Unidade Gestora</v-list-subheader>
      <v-list-item
        v-for="(u, i) in store.unidades"
        :key="i"
        :value="i"
        mandatory
        color="primary"
      >
        <v-list-item-title>{{ u.nome }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { mergeProps } from 'vue'

const props = defineProps({
  mobile: Boolean,
})

const store = useMainStore()
const configStore = useConfigStore()

const { pending, error } = await store.fetchUnidades(true)
if (error.value) {
  useToast().error('Ocorreu um erro ao carregar a lista de Unidades.')
  console.error(error)
}

const selectedUnidade = computed({
  get() {
    return store.unidades.findIndex((unidade) => {
      return unidade._id === configStore.unidade?._id
    })
  },
  set(index) {
    configStore.unidade = store.unidades[index]

    setTimeout(() => {
      navigateTo({ name: 'index' })
    }, 250)
  },
})

onUnmounted(() => {
  store.clearUnidades()
})
</script>
