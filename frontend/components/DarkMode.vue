<template>
  <v-tooltip location="bottom">
    <template #activator="{ props: tooltipProps }">
      <div
        class="me-3"
      >
        <v-switch
          v-bind="tooltipProps"
          v-model="darkMode"
          inset
          density="compact"
          hide-details
          color="primary"
          :label="props.mobile ? 'Modo Escuro' : ''"
          :prepend-icon="!props.mobile ? 'mdi-theme-light-dark' : undefined"
        />
      </div>
    </template>
    <span>{{ darkMode ? 'Ativar Modo Claro' : 'Ativar Modo Escuro' }}</span>
  </v-tooltip>
</template>

<script setup>
import { useTheme } from 'vuetify'

const props = defineProps({
  mobile: Boolean,
})

const configStore = useConfigStore()
const { darkMode } = storeToRefs(configStore)

const theme = useTheme()

watch(darkMode, (newValue) => {
  theme.global.name.value = newValue ? 'dark' : 'light'
})
</script>
